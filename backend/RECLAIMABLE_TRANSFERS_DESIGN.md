# Reclaimable Transfers Feature Design

## Overview

The **Reclaimable Transfers** feature allows financial transactions that expect recovery to be tracked through their lifecycle. This is useful for:

- Insurance claims (expense now, recovery later)
- Expense advances (pay out-of-pocket, get reimbursed)
- Security deposits (paid to vendor, recovered on return)
- Loan disbursements (money out, loan repayment back)

## Workflow Diagram

```
Step 1: EXPENSE INCURRED
┌─────────────────────────────────────────┐
│ Create Transfer                         │
│ From: Account (My Account)              │
│ To: Sink (Insurance Claim)              │
│ Amount: $1,000                          │
│ is_reclaimable: true                    │
│ reclaimable_source_name: "Acme Ins"     │
└─────────────────────────────────────────┘
           ↓
    Transfer.id = "txn_001"
    Transfer.is_reclaimable = true
    Transfer.reclaimed_by_transfer_id = NULL
           ↓

Step 2: RECOVERY RECEIVED
┌─────────────────────────────────────────┐
│ Create Transfer                         │
│ From: Source (Acme Insurance)           │
│ To: Account (My Account)                │
│ Amount: $1,000                          │
│ reclaimed_from_transfer_id: "txn_001"   │
└─────────────────────────────────────────┘
           ↓
    Transfer.id = "txn_002"
    System automatically updates:
    - txn_001.reclaimed_by_transfer_id = "txn_002"
           ↓

Result: BIDIRECTIONAL LINK ESTABLISHED
    txn_001.reclaimed_by_transfer_id = "txn_002" ← Original points to recovery
    txn_002.reclaimed_from_transfer_id = "txn_001" ← Recovery points to original
```

## Data Model

### Transfer Table (Extended Fields)

| Field | Type | Required | Constraint | Description |
|-------|------|----------|-----------|-------------|
| id | UUID | Yes | PK | Unique transfer identifier |
| date | DateTime | Yes | | When transfer occurred |
| amount | Numeric(15,2) | Yes | > 0 | Transfer amount |
| currency | String(3) | Yes | ISO 4217 | Currency code (USD, EUR, etc) |
| description | String(1000) | No | | Free-form notes |
| ingress_type | String(20) | Yes | IN ('account','source') | Source entity type |
| ingress_id | String | Yes | | Source entity ID |
| egress_type | String(20) | Yes | IN ('account','sink') | Destination entity type |
| egress_id | String | Yes | | Destination entity ID |
| **is_reclaimable** | Boolean | No | Default false | Is recovery expected? |
| **reclaimable_source_name** | String(255) | No* | *Required if is_reclaimable | Name of expected recovery source |
| **reclaimed_by_transfer_id** | UUID | No | UNIQUE, FK | ID of recovery transfer (if recovered) |
| category_id | String | No | FK | Category for organization |
| created_at | DateTime | Yes | | Creation timestamp |
| updated_at | DateTime | Yes | | Last update timestamp |

### Business Rules

#### Creating Account → Sink Transfers (Expenses)

1. **Transfer Type Check**: Only transfers with `ingress_type='account'` AND `egress_type='sink'` can have `is_reclaimable=true`
2. **Source Name Required**: If `is_reclaimable=true`, then `reclaimable_source_name` MUST be provided
3. **Reclaimable at Creation**: The `is_reclaimable` flag is set at transfer creation and cannot be changed
4. **State After Creation**:
   - `is_reclaimable = true`
   - `reclaimable_source_name = "Acme Insurance Co"`
   - `reclaimed_by_transfer_id = NULL` (waiting for recovery)

#### Creating Source → Account Transfers (Recoveries)

1. **Recovery Linking**: Source → Account transfers can have `reclaimed_from_transfer_id` pointing to a reclaimable transfer
2. **Validation Checks**:
   - Referenced transfer must exist
   - Referenced transfer must have `is_reclaimable = true`
   - Referenced transfer must NOT already have `reclaimed_by_transfer_id` set (one recovery per expense)
3. **Bidirectional Update**: When creating recovery transfer with `reclaimed_from_transfer_id`:
   - System creates the new recovery transfer
   - System automatically updates: `original.reclaimed_by_transfer_id = recovery.id`
   - Both transfers now point to each other

#### Querying Transfers

- **Pending Recovery**: `is_reclaimable=true` AND `reclaimed_by_transfer_id IS NULL`
- **Recovered**: `reclaimed_by_transfer_id IS NOT NULL`
- **Not Reclaimable**: `is_reclaimable=false`

## API Endpoints

### Create Transfer

**POST** `/api/transfers`

**Request (Account → Sink, Reclaimable):**
```json
{
  "date": "2024-01-15T10:30:00",
  "amount": 1000.00,
  "currency": "USD",
  "description": "Medical expense - expecting insurance recovery",
  "ingress_type": "account",
  "ingress_id": "acc_123",
  "egress_type": "sink",
  "egress_id": "sink_medical",
  "category_id": "cat_healthcare",
  "is_reclaimable": true,
  "reclaimable_source_name": "Acme Insurance Co"
}
```

**Response (201 Created):**
```json
{
  "id": "txn_001",
  "date": "2024-01-15T10:30:00",
  "amount": 1000.00,
  "currency": "USD",
  "description": "Medical expense...",
  "ingress_type": "account",
  "ingress_id": "acc_123",
  "egress_type": "sink",
  "egress_id": "sink_medical",
  "category_id": "cat_healthcare",
  "is_reclaimable": true,
  "reclaimable_source_name": "Acme Insurance Co",
  "reclaimed_by_transfer_id": null,
  "recovery_status": "pending_recovery",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

---

**Request (Source → Account, Recovering):**
```json
{
  "date": "2024-02-10T14:15:00",
  "amount": 1000.00,
  "currency": "USD",
  "description": "Insurance payout received",
  "ingress_type": "source",
  "ingress_id": "src_acme_ins",
  "egress_type": "account",
  "egress_id": "acc_123",
  "category_id": "cat_healthcare",
  "reclaimed_from_transfer_id": "txn_001"
}
```

**Response (201 Created):**
```json
{
  "id": "txn_002",
  "date": "2024-02-10T14:15:00",
  "amount": 1000.00,
  "currency": "USD",
  "description": "Insurance payout received",
  "ingress_type": "source",
  "ingress_id": "src_acme_ins",
  "egress_type": "account",
  "egress_id": "acc_123",
  "category_id": "cat_healthcare",
  "is_reclaimable": false,
  "reclaimable_source_name": null,
  "reclaimed_by_transfer_id": null,
  "recovery_status": "not_reclaimable",
  "recovery_transfer": {
    "id": "txn_001",
    "is_reclaimable": true,
    "reclaimed_by_transfer_id": "txn_002",
    "recovery_status": "recovered",
    ...
  },
  "created_at": "2024-02-10T14:15:00",
  "updated_at": "2024-02-10T14:15:00"
}
```

### Get Transfer

**GET** `/api/transfers/{id}`

Returns single transfer with full recovery details.

### List Transfers

**GET** `/api/transfers?ingress_type=account&is_reclaimable=true&recovered=false&limit=20&offset=0`

Query parameters:
- `ingress_type`: Filter by source type (account, source)
- `ingress_id`: Filter by source entity ID
- `egress_type`: Filter by destination type (account, sink)
- `egress_id`: Filter by destination entity ID
- `category_id`: Filter by category
- `is_reclaimable`: Filter by reclaimable status (true/false)
- `recovered`: Filter by recovery status (true/false)
- `limit`: Pagination limit (default 20, max 100)
- `offset`: Pagination offset

### List Pending Recoveries

**GET** `/api/transfers/pending-recovery?limit=20&offset=0`

Returns Account → Sink transfers where `is_reclaimable=true` AND `reclaimed_by_transfer_id IS NULL`.

### List Recovery History

**GET** `/api/transfers/recovery-history?limit=20&offset=0`

Returns all transfers where `reclaimed_by_transfer_id IS NOT NULL` (recovered expenses).

### Get Transfer Summary

**GET** `/api/transfers/stats/summary`

Returns statistics:
```json
{
  "total_transfers": 42,
  "reclaimable_transfers": 15,
  "pending_recovery": 8,
  "recovered": 7
}
```

### Update Transfer

**PATCH** `/api/transfers/{id}`

Can only update metadata (description, category_id). Cannot modify amounts or recovery links.

### Delete Transfer

**DELETE** `/api/transfers/{id}`

If deleting a recovery transfer, automatically clears the `reclaimed_by_transfer_id` on the original reclaimable transfer.

## Error Scenarios

### 1. Marking Non-Sink Transfer as Reclaimable

**Request:**
```json
{
  "ingress_type": "source",
  "egress_type": "account",
  "is_reclaimable": true,
  "reclaimable_source_name": "Test"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Validation error",
  "details": "is_reclaimable=true only valid for Account → Sink transfers"
}
```

### 2. Missing Required Source Name

**Request:**
```json
{
  "ingress_type": "account",
  "egress_type": "sink",
  "is_reclaimable": true
  // Missing reclaimable_source_name
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Validation error",
  "details": "reclaimable_source_name required when is_reclaimable=true"
}
```

### 3. Double Recovery

**Request:** (Attempt to recover same transfer twice)
```json
{
  "reclaimed_from_transfer_id": "txn_001"  // Already recovered
}
```

**Response (409 Conflict):**
```json
{
  "error": "Transfer already recovered",
  "details": "Transfer txn_001 was already recovered by txn_002"
}
```

### 4. Recovering Non-Reclaimable Transfer

**Request:**
```json
{
  "reclaimed_from_transfer_id": "txn_999"  // is_reclaimable=false
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid recovery linking",
  "details": "Can only recover transfers marked as reclaimable"
}
```

## Edge Cases & Considerations

### Partial Recoveries

Currently, the system enforces one-to-one recovery relationships (one recovery per reclaimable transfer). If partial recoveries are needed in the future:
- Create multiple reclaimable transfers for portions
- Or allow many-to-many with amount tracking

### Currency Mismatch

Currently no validation that recovery currency matches original. Future enhancement could warn or error if mismatched.

### Multi-Source Recoveries

If recovery comes from different source than `reclaimable_source_name`, the system allows it but logs in transfer description.

### Time Window for Recovery

No enforced time window. Can recover weeks/months/years after original transfer. Can be added if needed via business rules.

## Database Indexes

```
- idx_transfer_date: (date)
- idx_transfer_reclaimable_pending: (is_reclaimable, reclaimed_by_transfer_id)
  └─ Optimizes "pending recovery" queries
- idx_transfer_recovery_link: (reclaimed_by_transfer_id)
  └─ Optimizes recovery history queries
```

## Testing Strategy

### Unit Tests
- [x] Create reclaimable Account → Sink transfer
- [x] Create recovery Source → Account transfer
- [x] Verify bidirectional linking is correct
- [x] Cannot mark non-Sink as reclaimable
- [x] Source name required when is_reclaimable
- [x] Cannot recover non-reclaimable transfer
- [x] Cannot double-recover transfer
- [x] Recovery linking only for Source → Account

### Integration Tests
- [x] Complete workflow: Create expense, query pending, recover
- [x] Query pending recoveries
- [x] Query recovery history
- [x] Transfer statistics

### Edge Cases
- [ ] Partial recovery scenario (future)
- [ ] Currency mismatch handling (future)
- [ ] Delete cascade behavior
- [ ] Concurrent recovery attempts

## Implementation Notes

### Assumptions Made

1. **One-to-One Recovery**: Each reclaimable transfer can have exactly ONE recovery transfer. Enforced via `UNIQUE` constraint on `reclaimed_by_transfer_id`.

2. **Bidirectional Linking**: When creating recovery transfer with `reclaimed_from_transfer_id`, the system automatically updates the original transfer's `reclaimed_by_transfer_id`. This is atomic.

3. **Immutable Recovery Links**: Once set, recovery links cannot be changed. Must delete and recreate.

4. **No Amount Validation**: Recovery amount doesn't have to match original amount. System allows partial/full/excess recoveries. Amount matching is business logic concern.

5. **Source Name is Advisory**: The `reclaimable_source_name` is just a label. Recovery can come from any Source. Used for context/filtering.

### Future Enhancements

- [ ] Soft deletes for transfer audit trail
- [ ] Partial recovery tracking (separate model)
- [ ] Recovery deadline/expiration dates
- [ ] Automatic balance adjustment on recovery
- [ ] Exchange rate tracking for multi-currency
- [ ] Approval workflow for recoveries
- [ ] Notifications when recovery received

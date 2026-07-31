import { useState, useEffect } from 'react'
import { getAccounts, createAccount, updateAccount, deleteAccount } from '../api/accounts'

export default function SettingsAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    iban: '',
    currency: 'EUR',
    initial_balance: '',
    description: '',
  })
  const [formErrors, setFormErrors] = useState({})

  // Load accounts on mount
  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAccounts()
      setAccounts(data)
    } catch (err) {
      console.error('Failed to load accounts:', err)
      setError('Failed to load accounts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreateModal = () => {
    setEditingAccount(null)
    setFormData({
      name: '',
      iban: '',
      currency: 'EUR',
      initial_balance: '',
      description: '',
    })
    setFormErrors({})
    setShowModal(true)
  }

  const handleOpenEditModal = (account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      iban: account.iban,
      currency: account.currency,
      initial_balance: account.balance?.toString() || '',
      description: account.description || '',
    })
    setFormErrors({})
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAccount(null)
    setFormErrors({})
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Account name is required'
    if (!formData.iban.trim()) errors.iban = 'IBAN is required'
    if (formData.initial_balance && isNaN(parseFloat(formData.initial_balance))) {
      errors.initial_balance = 'Balance must be a valid number'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      const payload = {
        name: formData.name,
        iban: formData.iban,
        currency: formData.currency,
        description: formData.description,
      }
      if (formData.initial_balance) {
        payload.balance = parseFloat(formData.initial_balance)
      }

      if (editingAccount) {
        await updateAccount(editingAccount.id, payload)
      } else {
        await createAccount(payload)
      }
      await loadAccounts()
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save account:', err)
      setError('Failed to save account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return

    try {
      setLoading(true)
      await deleteAccount(accountId)
      await loadAccounts()
    } catch (err) {
      console.error('Failed to delete account:', err)
      setError('Failed to delete account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatBalance = (balance, currency) => {
    const formatted = Math.abs(balance).toFixed(2)
    const currencySymbol = { EUR: '€', USD: '$', GBP: '£', CHF: 'CHF', JPY: '¥' }[currency] || currency
    return `${currencySymbol}${formatted}`
  }

  return (
    <div>
      {error && (
        <div style={styles.message}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={styles.header}>
        <h2 style={styles.title}>Manage Accounts</h2>
        <button
          style={styles.btnGlowing}
          onClick={handleOpenCreateModal}
          disabled={loading}
        >
          + Create New Account
        </button>
      </div>

      {loading && accounts.length === 0 ? (
        <div style={styles.loading}>Loading accounts...</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>IBAN</th>
              <th>Currency</th>
              <th>Balance</th>
              <th>Created</th>
              <th style={styles.actionsHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td style={styles.nameCell}>
                  <strong>{account.name}</strong>
                </td>
                <td style={styles.monoCell}>{account.iban}</td>
                <td>{account.currency}</td>
                <td style={styles.balanceCell}>
                  {formatBalance(account.balance || 0, account.currency)}
                </td>
                <td style={styles.dateCell}>
                  {account.created_at
                    ? new Date(account.created_at).toLocaleDateString()
                    : '—'}
                </td>
                <td style={styles.actionsCell}>
                  <button
                    style={styles.btnEdit}
                    onClick={() => handleOpenEditModal(account)}
                    title="Edit account"
                    disabled={loading}
                  >
                    ✏️
                  </button>
                  <button
                    style={styles.btnDelete}
                    onClick={() => handleDeleteAccount(account.id)}
                    title="Delete account"
                    disabled={loading}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>
                {editingAccount ? 'Edit Account' : 'Create New Account'}
              </h2>
              <button
                style={styles.closeBtn}
                onClick={handleCloseModal}
                disabled={loading}
              >
                ×
              </button>
            </div>

            <div style={styles.modalBody}>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Account Name *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={loading}
                  />
                  {formErrors.name && (
                    <div style={styles.error}>{formErrors.name}</div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>IBAN *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.iban}
                    onChange={(e) =>
                      setFormData({ ...formData, iban: e.target.value })
                    }
                    placeholder="e.g., DE89370400440532013000"
                    disabled={loading}
                  />
                  {formErrors.iban && (
                    <div style={styles.error}>{formErrors.iban}</div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Currency</label>
                  <select
                    style={styles.select}
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    disabled={loading}
                  >
                    <option value="EUR">EUR (Euro)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="GBP">GBP (British Pound)</option>
                    <option value="CHF">CHF (Swiss Franc)</option>
                    <option value="JPY">JPY (Japanese Yen)</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Initial Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    style={styles.input}
                    value={formData.initial_balance}
                    onChange={(e) =>
                      setFormData({ ...formData, initial_balance: e.target.value })
                    }
                    placeholder="0.00"
                    disabled={loading}
                  />
                  {formErrors.initial_balance && (
                    <div style={styles.error}>{formErrors.initial_balance}</div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    style={styles.textarea}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Optional description"
                    rows="3"
                    disabled={loading}
                  />
                </div>

                <div style={styles.modalFooter}>
                  <button
                    type="button"
                    style={styles.btnCancel}
                    onClick={handleCloseModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={styles.btnSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  btnGlowing: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
    transition: 'all 0.3s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  message: {
    padding: '12px 16px',
    marginBottom: '16px',
    borderRadius: '6px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderLeft: '4px solid #ef4444',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#6b7280',
  },
  nameCell: {
    fontWeight: '500',
    color: '#1f2937',
  },
  monoCell: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#6b7280',
  },
  balanceCell: {
    fontWeight: '600',
    color: '#10b981',
    fontFamily: 'monospace',
  },
  dateCell: {
    fontSize: '13px',
    color: '#6b7280',
  },
  actionsHeader: {
    textAlign: 'center',
  },
  actionsCell: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },
  btnEdit: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px',
    transition: 'transform 0.2s',
    color: '#3b82f6',
  },
  btnDelete: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px',
    transition: 'transform 0.2s',
    color: '#ef4444',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: 0,
    width: '32px',
    height: '32px',
  },
  modalBody: {
    padding: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#1f2937',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '4px',
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  btnCancel: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
  },
  btnSubmit: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    backgroundColor: '#3b82f6',
    color: 'white',
  },
}

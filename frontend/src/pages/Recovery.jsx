import './Common.css'

export default function Recovery() {
  const recoveryTransfers = [
    {
      id: 1,
      date: '2024-01-12',
      description: 'Recovery from emergency fund',
      amount: 450.00,
      reclaimedFrom: 'Emergency expense',
      status: 'Completed'
    }
  ]

  return (
    <div className="page">
      <h2>Recovery Transfers</h2>
      <p className="page-subtitle">Source → Account transfers linked to reclaimable transfers</p>

      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Reclaimed From</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recoveryTransfers.map((transfer) => (
              <tr key={transfer.id}>
                <td>{transfer.date}</td>
                <td>{transfer.description}</td>
                <td className="amount">${transfer.amount.toFixed(2)}</td>
                <td>{transfer.reclaimedFrom}</td>
                <td>
                  <span className="badge badge-success">{transfer.status}</span>
                </td>
                <td>
                  <button className="btn-small">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

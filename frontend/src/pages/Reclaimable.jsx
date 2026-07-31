import './Common.css'

export default function Reclaimable() {
  const reclaimableTransfers = [
    {
      id: 1,
      date: '2024-01-10',
      description: 'Emergency expense',
      amount: 450.00,
      sourceName: 'Emergency Fund',
      status: 'Pending Recovery'
    }
  ]

  return (
    <div className="page">
      <h2>Reclaimable Transfers</h2>
      <p className="page-subtitle">Account → Sink transfers marked as reclaimable</p>

      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Expected Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reclaimableTransfers.map((transfer) => (
              <tr key={transfer.id}>
                <td>{transfer.date}</td>
                <td>{transfer.description}</td>
                <td className="amount">${transfer.amount.toFixed(2)}</td>
                <td>{transfer.sourceName}</td>
                <td>
                  <span className="badge badge-warning">{transfer.status}</span>
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

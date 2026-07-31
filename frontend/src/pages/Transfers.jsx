import { useState } from 'react'
import './Transfers.css'

export default function Transfers() {
  const [transfers] = useState([
    {
      id: 1,
      date: '2024-01-15',
      description: 'Grocery shopping',
      type: 'Standard',
      amount: 125.50,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-01-14',
      description: 'Salary deposit',
      type: 'Income',
      amount: 3500.00,
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-01-13',
      description: 'Utilities bill',
      type: 'Standard',
      amount: 250.00,
      status: 'Completed'
    }
  ])

  return (
    <div className="transfers-page">
      <div className="page-header">
        <h2>Transfers</h2>
        <button className="btn btn-primary">+ New Transfer</button>
      </div>

      <div className="page-filters">
        <input type="search" placeholder="Search transfers..." className="filter-input" />
        <select className="filter-select">
          <option>All Types</option>
          <option>Income</option>
          <option>Expense</option>
          <option>Transfer</option>
        </select>
        <select className="filter-select">
          <option>All Status</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>
      </div>

      <div className="table-container">
        <table className="transfers-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr key={transfer.id}>
                <td>{transfer.date}</td>
                <td>{transfer.description}</td>
                <td>
                  <span className={`badge badge-${transfer.type.toLowerCase()}`}>
                    {transfer.type}
                  </span>
                </td>
                <td className="amount">${transfer.amount.toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${transfer.status.toLowerCase()}`}>
                    {transfer.status}
                  </span>
                </td>
                <td>
                  <button className="btn-small">Edit</button>
                  <button className="btn-small btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn-small">← Previous</button>
        <span>Page 1 of 1</span>
        <button className="btn-small">Next →</button>
      </div>
    </div>
  )
}

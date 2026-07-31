import './Common.css'

export default function Accounts() {
  const accounts = [
    {
      id: 1,
      name: 'Main Checking',
      iban: 'DE89370400440532013000',
      currency: 'EUR',
      balance: 12450.50
    },
    {
      id: 2,
      name: 'Savings',
      iban: 'DE89370400440532013001',
      currency: 'EUR',
      balance: 25000.00
    }
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h2>My Accounts</h2>
        <button className="btn btn-primary">+ Add Account</button>
      </div>

      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>IBAN</th>
              <th>Currency</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td className="iban">{account.iban}</td>
                <td>{account.currency}</td>
                <td className="amount">${account.balance.toFixed(2)}</td>
                <td>
                  <button className="btn-small">Edit</button>
                  <button className="btn-small btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

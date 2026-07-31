import './Dashboard.css'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Balance</h3>
          <p className="stat-value">$12,450.50</p>
          <p className="stat-change positive">+2.5% this month</p>
        </div>
        <div className="stat-card">
          <h3>This Month's Income</h3>
          <p className="stat-value">$5,200.00</p>
          <p className="stat-change">5 sources</p>
        </div>
        <div className="stat-card">
          <h3>This Month's Expenses</h3>
          <p className="stat-value">$3,150.75</p>
          <p className="stat-change negative">12 transactions</p>
        </div>
        <div className="stat-card">
          <h3>Pending Recovery</h3>
          <p className="stat-value">$450.00</p>
          <p className="stat-change">2 transfers</p>
        </div>
      </div>
    </div>
  )
}

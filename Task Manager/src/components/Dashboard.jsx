function Dashboard({ total, completed, pending }) {
  return (
    <div className="dashboard">
      <div className="card">
        <h3>{total}</h3>
        <p>Total</p>
      </div>

      <div className="card">
        <h3>{completed}</h3>
        <p>Completed</p>
      </div>

      <div className="card">
        <h3>{pending}</h3>
        <p>Pending</p>
      </div>
    </div>
  );
}

export default Dashboard;
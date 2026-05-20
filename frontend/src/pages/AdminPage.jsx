import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [tab, setTab] = useState("users");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((r) => setStats(r.data.data))
      .catch(() => {});
    api
      .get("/admin/users")
      .then((r) => setUsers(r.data.data))
      .catch(() => {});
    api
      .get("/admin/donations")
      .then((r) => setDonations(r.data.data))
      .catch(() => {});
  }, []);

  const handleVerify = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/verify`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isVerified: true } : u)),
      );
    } catch (err) {
      alert("Verification failed");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Panel</h1>
      </div>

      {stats && (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Users</div>
            <div className="metric-value">{stats.totalUsers}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Donations</div>
            <div className="metric-value">{stats.totalDonations}</div>
          </div>
          <div className="metric-card green">
            <div className="metric-label">Completed</div>
            <div className="metric-value green">
              {stats.claims.completed || 0}
            </div>
          </div>
          <div className="metric-card amber">
            <div className="metric-label">Active Now</div>
            <div className="metric-value amber">
              {stats.donations.available || 0}
            </div>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        {["users", "donations"].map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "users" ? "👥 Users" : "🍽 Donations"}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Reliability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td className="muted">{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.isVerified ? "✅" : "⏳"}</td>
                  <td>{((u.reliabilityScore || 0.5) * 100).toFixed(0)}%</td>
                  <td>
                    {!u.isVerified && u.role !== "admin" && (
                      <button
                        className="btn-primary small"
                        onClick={() => handleVerify(u._id)}
                      >
                        Verify
                      </button>
                    )}
                    {u.role !== "admin" && (
                      <button
                        className="btn-danger small"
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "donations" && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Food</th>
                <th>Donor</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Expiry</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d._id}>
                  <td>{d.food_title}</td>
                  <td className="muted">{d.donor_id?.name}</td>
                  <td>{d.quantity}</td>
                  <td>
                    <span className={`status-pill status-${d.status}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="muted">
                    {new Date(d.expiry_datetime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

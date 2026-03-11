import { useEffect, useState } from "react";

import { api } from "../api/client";
import AdminHeader from "../components/admin/AdminHeader";
import { useAuth } from "../context/AuthContext";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "admin" });
  const [notice, setNotice] = useState("");

  async function loadUsers() {
    if (!token) return;
    const data = await api.listAdminUsers(token);
    setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, [token]);

  async function createUser(event) {
    event.preventDefault();
    if (!token) return;
    setNotice("");
    try {
      await api.createAdminUser(token, newUser);
      setNewUser({ username: "", password: "", role: "admin" });
      setNotice("Admin user created.");
      await loadUsers();
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function toggleUser(user) {
    if (!token) return;
    await api.updateAdminUser(token, user.id, { is_active: !user.is_active });
    await loadUsers();
  }

  async function changeRole(user, role) {
    if (!token) return;
    await api.updateAdminUser(token, user.id, { role });
    await loadUsers();
  }

  return (
    <div className="space-y-5">
      <AdminHeader title="Admin Users" subtitle="Manage admin roles and active status." />
      {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900">Add New Admin</h3>
        <form className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={createUser}>
          <input
            className="rounded-xl border border-slate-200 px-3 py-2"
            placeholder="Username"
            value={newUser.username}
            onChange={(event) => setNewUser((prev) => ({ ...prev, username: event.target.value }))}
            required
          />
          <input
            className="rounded-xl border border-slate-200 px-3 py-2"
            type="password"
            placeholder="Password (min 8)"
            value={newUser.password}
            onChange={(event) => setNewUser((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <select
            className="rounded-xl border border-slate-200 px-3 py-2"
            value={newUser.role}
            onChange={(event) => setNewUser((prev) => ({ ...prev, role: event.target.value }))}
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <button type="submit" className="rounded-xl bg-emerald-600 text-white font-semibold px-4 py-2">
            Add User
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Username</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100">
                <td className="px-4 py-4 font-semibold text-slate-900">{user.username}</td>
                <td className="px-4 py-4">
                  <select
                    value={user.role}
                    onChange={(event) => changeRole(user, event.target.value)}
                    className="rounded-lg border border-slate-200 px-2 py-1"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-4">{new Date(user.created_at).toLocaleString()}</td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => toggleUser(user)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                  >
                    {user.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}


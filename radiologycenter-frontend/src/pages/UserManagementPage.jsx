import React, { useEffect, useState, useMemo } from 'react';
import userService from '../services/userService';
import Modal from '../components/common/Modal';
import { useToast } from '../components/ToastContext';

const PAGE_SIZE = 10;

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [modalType, setModalType] = useState(''); // 'edit' | 'delete' | 'activate' | 'deactivate'
  const [form, setForm] = useState({ fullName: '', email: '', role: '' });
  const [formLoading, setFormLoading] = useState(false);
  const { showToast } = useToast();

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search and pagination
  const filtered = useMemo(() => {
    return users.filter(u =>
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Modal handlers
  const handleEdit = (user) => {
    setSelected(user);
    setForm({ fullName: user.fullName, email: user.email, role: user.role });
    setModalType('edit');
  };
  const handleDelete = (user) => {
    setSelected(user);
    setModalType('delete');
  };
  const handleActivate = (user) => {
    setSelected(user);
    setModalType('activate');
  };
  const handleDeactivate = (user) => {
    setSelected(user);
    setModalType('deactivate');
  };

  // CRUD logic
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await userService.update(selected.id, {
        id: selected.id,
        fullName: form.fullName,
        email: form.email,
        role: form.role,
        isActive: selected.isActive,
      });
      setUsers(prev => prev.map(u => u.id === selected.id ? { ...u, ...form } : u));
      showToast('User updated successfully');
      setModalType('');
    } catch (err) {
      showToast(err.response?.data?.error || 'Update failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };
  const handleDeleteConfirm = async () => {
    setFormLoading(true);
    try {
      await userService.remove(selected.id);
      setUsers(prev => prev.filter(u => u.id !== selected.id));
      showToast('User deleted successfully');
      setModalType('');
    } catch (err) {
      showToast(err.response?.data?.error || 'Delete failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };
  const handleActivateConfirm = async () => {
    setFormLoading(true);
    try {
      await userService.activate(selected.id);
      setUsers(prev => prev.map(u => u.id === selected.id ? { ...u, isActive: true } : u));
      showToast('User activated');
      setModalType('');
    } catch (err) {
      showToast(err.response?.data?.error || 'Activation failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };
  const handleDeactivateConfirm = async () => {
    setFormLoading(true);
    try {
      await userService.deactivate(selected.id);
      setUsers(prev => prev.map(u => u.id === selected.id ? { ...u, isActive: false } : u));
      showToast('User deactivated');
      setModalType('');
    } catch (err) {
      showToast(err.response?.data?.error || 'Deactivation failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Pagination controls
  const handlePageChange = (n) => setPage(n);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">User Management</h2>
        <input
          type="text"
          className="input input-bordered"
          placeholder="Search users..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      {loading ? (
        <div className="flex justify-center"><span className="loading loading-spinner"></span></div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="text-center">No users found.</td></tr>
              ) : paginated.map((u) => (
                <tr key={u.id}>
                  <td>{u.userName}</td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="flex gap-2">
                    <button className="btn btn-xs btn-outline" onClick={() => handleEdit(u)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(u)}>Delete</button>
                    {u.isActive ? (
                      <button className="btn btn-xs btn-warning" onClick={() => handleDeactivate(u)}>Deactivate</button>
                    ) : (
                      <button className="btn btn-xs btn-success" onClick={() => handleActivate(u)}>Activate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`btn btn-sm ${n === page ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => handlePageChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
      )}
      {/* Edit Modal */}
      <Modal
        open={modalType === 'edit'}
        onClose={() => setModalType('')}
        title="Edit User"
        actions={null}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <input
            className="input input-bordered w-full"
            placeholder="Full Name"
            value={form.fullName}
            onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
            required
          />
          <input
            className="input input-bordered w-full"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Role"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => setModalType('')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? <span className="loading loading-spinner"></span> : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
      {/* Delete Modal */}
      <Modal
        open={modalType === 'delete'}
        onClose={() => setModalType('')}
        title="Delete User"
        actions={[
          <button key="cancel" className="btn btn-ghost" onClick={() => setModalType('')}>Cancel</button>,
          <button key="delete" className="btn btn-error" onClick={handleDeleteConfirm} disabled={formLoading}>
            {formLoading ? <span className="loading loading-spinner"></span> : 'Delete'}
          </button>,
        ]}
      >
        <p>Are you sure you want to delete <b>{selected?.userName}</b>?</p>
      </Modal>
      {/* Activate Modal */}
      <Modal
        open={modalType === 'activate'}
        onClose={() => setModalType('')}
        title="Activate User"
        actions={[
          <button key="cancel" className="btn btn-ghost" onClick={() => setModalType('')}>Cancel</button>,
          <button key="activate" className="btn btn-success" onClick={handleActivateConfirm} disabled={formLoading}>
            {formLoading ? <span className="loading loading-spinner"></span> : 'Activate'}
          </button>,
        ]}
      >
        <p>Activate user <b>{selected?.userName}</b>?</p>
      </Modal>
      {/* Deactivate Modal */}
      <Modal
        open={modalType === 'deactivate'}
        onClose={() => setModalType('')}
        title="Deactivate User"
        actions={[
          <button key="cancel" className="btn btn-ghost" onClick={() => setModalType('')}>Cancel</button>,
          <button key="deactivate" className="btn btn-warning" onClick={handleDeactivateConfirm} disabled={formLoading}>
            {formLoading ? <span className="loading loading-spinner"></span> : 'Deactivate'}
          </button>,
        ]}
      >
        <p>Deactivate user <b>{selected?.userName}</b>?</p>
      </Modal>
    </div>
  );
};

export default UserManagementPage; 
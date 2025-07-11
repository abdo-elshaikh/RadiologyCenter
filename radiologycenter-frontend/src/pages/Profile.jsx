import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Password change state
  const [pw, setPw] = useState({ old: '', new: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    setFullName(user?.fullName || '');
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.updateProfile({ fullName });
      setSuccess('Profile updated successfully.');
      setEditing(false);
      refreshUser && refreshUser();
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError('');
    setPwSuccess('');
    if (!pw.old || !pw.new || !pw.confirm) {
      setPwError('All password fields are required.');
      setPwLoading(false);
      return;
    }
    if (pw.new !== pw.confirm) {
      setPwError('New passwords do not match.');
      setPwLoading(false);
      return;
    }
    try {
      await authService.changePassword({ username: user.username, oldPassword: pw.old, newPassword: pw.new });
      setPwSuccess('Password changed successfully.');
      setPw({ old: '', new: '', confirm: '' });
    } catch (err) {
      setPwError(err.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="card bg-base-100 shadow p-6 mb-8">
        <div className="mb-4">
          <label className="label">Username</label>
          <input className="input input-bordered w-full" value={user?.username} disabled />
        </div>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="label">Full Name</label>
            <input
              className="input input-bordered w-full"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              disabled={!editing}
              required
            />
          </div>
          {error && <div className="alert alert-error mb-2">{error}</div>}
          {success && <div className="alert alert-success mb-2">{success}</div>}
          <div className="flex gap-2">
            {editing ? (
              <>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? <span className="loading loading-spinner"></span> : 'Save'}
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => { setEditing(false); setFullName(user.fullName); }}>Cancel</button>
              </>
            ) : (
              <button className="btn btn-outline" type="button" onClick={() => setEditing(true)}>Edit</button>
            )}
          </div>
        </form>
      </div>
      <div className="card bg-base-100 shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form onSubmit={handlePwChange} className="space-y-3">
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Current Password"
            value={pw.old}
            onChange={e => setPw(p => ({ ...p, old: e.target.value }))}
            required
          />
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="New Password"
            value={pw.new}
            onChange={e => setPw(p => ({ ...p, new: e.target.value }))}
            required
          />
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Confirm New Password"
            value={pw.confirm}
            onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
            required
          />
          {pwError && <div className="alert alert-error mb-2">{pwError}</div>}
          {pwSuccess && <div className="alert alert-success mb-2">{pwSuccess}</div>}
          <button className="btn btn-primary w-full" type="submit" disabled={pwLoading}>
            {pwLoading ? <span className="loading loading-spinner"></span> : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile; 
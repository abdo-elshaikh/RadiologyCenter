import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100 p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo192.png" alt="Logo" className="w-16 h-16 mb-2" />
          <h2 className="text-2xl font-bold">Forgot Password</h2>
          <p className="text-center text-base-content/70 mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        {success ? (
          <div className="text-center">
            <div className="alert alert-success mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Reset email sent! Check your inbox and spam folder.</span>
            </div>
            <p className="text-sm text-base-content/60">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-error py-2 px-4">{error}</div>}
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : 'Send Reset Email'}
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          Remember your password?{' '}
          <Link to="/login" className="link link-primary">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 
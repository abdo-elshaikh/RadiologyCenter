import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLogin, setKeepLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login({ username, password, keepLogin });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md p-8 space-y-4 bg-base-100 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-control flex-row items-center">
            <input
              type="checkbox"
              className="checkbox mr-2"
              checked={keepLogin}
              onChange={e => setKeepLogin(e.target.checked)}
              id="keepLogin"
            />
            <label htmlFor="keepLogin" className="label-text cursor-pointer">Keep me logged in</label>
          </div>
          {error && <div className="text-error text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <div>
            Don&apos;t have an account?{' '}
            <a href="/register" className="link link-secondary text-sm">Register</a>
          </div>
          <div>
            Forgot your password?{' '}
            <a
              href="/forgot-password" className="link link-secondary text-sm">Reset Password</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 
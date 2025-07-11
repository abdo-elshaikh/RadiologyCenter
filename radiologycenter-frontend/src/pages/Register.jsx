import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const initialState = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  confirmPassword: '',
};

const Register = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!values.firstName.trim() || !values.lastName.trim()) return 'First and last name are required.';
    if (!values.username.trim()) return 'Username is required.';
    if (values.password.length < 6) return 'Password must be at least 6 characters.';
    if (values.password !== values.confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        username: values.username,
        password: values.password,
        fullName: values.firstName + ' ' + values.lastName,
        role: 'User',
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100 p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo192.png" alt="Logo" className="w-16 h-16 mb-2" />
          <h2 className="text-2xl font-bold">Create Account</h2>
        </div>
        {success ? (
          <div className="alert alert-success mb-4">Registration successful! Redirecting to login...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <input
                name="firstName"
                className="input input-bordered w-1/2"
                placeholder="First Name"
                value={values.firstName}
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                className="input input-bordered w-1/2"
                placeholder="Last Name"
                value={values.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <input
              name="username"
              className="input input-bordered w-full"
              placeholder="Username"
              value={values.username}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              className="input input-bordered w-full"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              required
            />
            <input
              name="confirmPassword"
              type="password"
              className="input input-bordered w-full"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
              required
            />
            {error && <div className="alert alert-error py-2 px-4">{error}</div>}
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : 'Register'}
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="link link-primary">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar bg-background-dark shadow-md px-6 py-3 border-b border-primary-dark">
      <div className="flex-1">
        <span className="text-2xl font-extrabold text-primary">Radiology Center</span>
      </div>
      <div className="flex-none gap-4">
        {user && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
                {user.username[0].toUpperCase()}
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 p-3 shadow menu menu-sm dropdown-content bg-background-dark rounded-box w-56 border border-primary-dark">
              <li><a href="/profile" className="hover:text-primary-light">Profile</a></li>
              <li><button onClick={handleLogout} className="hover:text-secondary-light">Logout</button></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

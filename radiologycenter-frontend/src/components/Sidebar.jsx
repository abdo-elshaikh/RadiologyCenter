import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-background-dark min-h-screen p-6 border-r border-primary-dark">
      <nav className="flex flex-col gap-3">
        <Link to="/dashboard" className={`btn btn-ghost justify-start text-lg font-semibold ${pathname === '/dashboard' ? 'btn-active' : ''}`}>Dashboard</Link>
        <Link to="/patients" className={`btn btn-ghost justify-start text-lg font-semibold ${pathname === '/patients' ? 'btn-active' : ''}`}>Patients</Link>
        <Link to="/appointments" className={`btn btn-ghost justify-start text-lg font-semibold ${pathname === '/appointments' ? 'btn-active' : ''}`}>Appointments</Link>
        <Link to="/units" className={`btn btn-ghost justify-start text-lg font-semibold ${pathname === '/units' ? 'btn-active' : ''}`}>Units</Link>
        <Link to="/insurance-providers" className={`btn btn-ghost justify-start text-lg font-semibold ${pathname === '/insurance-providers' ? 'btn-active' : ''}`}>Insurance Providers</Link>
        <Link to="/examinations" className={`btn btn-ghost justify-start text-lg font-semibold ${pathname === '/examinations' ? 'btn-active' : ''}`}>Examinations</Link>
        <Link to="/contracts" className={`btn btn-ghost justify-start text-lg font-semibold ${pathname === '/contracts' ? 'btn-active' : ''}`}>Contracts</Link>
        <Link to="/patient-insurance" className={`btn btn-ghost justify-start text-lg font-semibold ${pathname === '/patient-insurance' ? 'btn-active' : ''}`}>Patient Insurance</Link>
        <Link to="/patient-contract" className={`btn btn-ghost justify-start text-lg font-semibold ${pathname === '/patient-contract' ? 'btn-active' : ''}`}>Patient Contract</Link>
        {/* Role-based link */}
        {user && (user.role === 'Admin' || user.role === 'Administrator') && (
          <Link to="/admin/users" className={`btn btn-ghost justify-start text-lg font-semibold ${pathname === '/admin/users' ? 'btn-active' : ''}`}>User Management</Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

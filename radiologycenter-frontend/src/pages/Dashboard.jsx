import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    activeUnits: 0,
    totalExaminations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API calls
    setTimeout(() => {
      setStats({
        totalPatients: 1247,
        appointmentsToday: 23,
        activeUnits: 8,
        totalExaminations: 156,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const quickActions = [
    { title: 'Add Patient', link: '/patients', icon: '👤', color: 'btn-primary' },
    { title: 'New Appointment', link: '/appointments', icon: '📅', color: 'btn-secondary' },
    { title: 'Manage Units', link: '/units', icon: '🏥', color: 'btn-accent' },
    { title: 'User Management', link: '/admin/users', icon: '👥', color: 'btn-info' },
  ];

  const recentActivity = [
    { action: 'New patient registered', time: '2 minutes ago', type: 'patient' },
    { action: 'Appointment scheduled', time: '15 minutes ago', type: 'appointment' },
    { action: 'Examination completed', time: '1 hour ago', type: 'examination' },
    { action: 'Unit updated', time: '2 hours ago', type: 'unit' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="stat-title">Total Patients</div>
          <div className="stat-value text-primary">{stats.totalPatients}</div>
          <div className="stat-desc">↗︎ 14% more than last month</div>
        </div>
        
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-secondary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="stat-title">Today's Appointments</div>
          <div className="stat-value text-secondary">{stats.appointmentsToday}</div>
          <div className="stat-desc">↗︎ 3 more than yesterday</div>
        </div>
        
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-accent">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="stat-title">Active Units</div>
          <div className="stat-value text-accent">{stats.activeUnits}</div>
          <div className="stat-desc">All units operational</div>
        </div>
        
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-info">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="stat-title">Total Examinations</div>
          <div className="stat-value text-info">{stats.totalExaminations}</div>
          <div className="stat-desc">↗︎ 8% more than last week</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className={`btn ${action.color} btn-lg`}>
              <span className="text-2xl mr-2">{action.icon}</span>
              {action.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-base-100 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>{activity.action}</span>
              </div>
              <span className="text-sm text-base-content/60">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
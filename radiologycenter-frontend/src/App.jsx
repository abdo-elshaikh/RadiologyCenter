import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Units from './pages/Units';
import InsuranceProviders from './pages/InsuranceProviders';
import Examinations from './pages/Examinations';
import Contracts from './pages/Contracts';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import UserManagementPage from './pages/UserManagementPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/patients" element={
          <ProtectedRoute>
            <Layout>
              <Patients />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute>
            <Layout>
              <Appointments />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/units" element={
          <ProtectedRoute>
            <Layout>
              <Units />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/insurance-providers" element={
          <ProtectedRoute>
            <Layout>
              <InsuranceProviders />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/examinations" element={
          <ProtectedRoute>
            <Layout>
              <Examinations />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/contracts" element={
          <ProtectedRoute>
            <Layout>
              <Contracts />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <RoleProtectedRoute roles={['Admin','Administrator']}>
            <UserManagementPage />
          </RoleProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

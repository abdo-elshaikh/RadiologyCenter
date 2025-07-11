import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-background-dark text-text-light">
    <Navbar />
    <div className="flex flex-1 max-w-7xl mx-auto w-full">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  </div>
);

export default Layout;

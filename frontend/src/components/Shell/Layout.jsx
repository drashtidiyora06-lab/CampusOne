import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;

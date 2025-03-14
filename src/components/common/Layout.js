import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children, title }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div id="app-screen" className="screen active-screen">
      <div className="app-container">
        <Sidebar />
        
        <div className="main-content">
          <Header 
            userName={currentUser?.name || 'Usuario'} 
            onLogout={handleLogout}
          />
          
          {title && <h2 style={{ margin: '20px 0', padding: '0 20px' }}>{title}</h2>}
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', icon: '📊', path: '/dashboard' },
    { id: 'invoices', icon: '📄', path: '/invoices' },
    { id: 'clients', icon: '👥', path: '/clients' },
    { id: 'settings', icon: '⚙️', path: '/settings' },
    { id: 'notifications', icon: '🔔', path: '/notifications' },
    { id: 'help', icon: '❓', path: '/help' },
  ];

  return (
    <div className="sidebar">
      {menuItems.map(item => (
        <div 
          key={item.id}
          className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default Sidebar; 

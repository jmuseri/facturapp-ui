import React from 'react';

const Header = ({ userName = 'Usuario' }) => {
  const userInitials = userName
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .substr(0, 2)
    .toUpperCase();

  return (
    <div className="header">
      <h2 style={{ margin: 0, color: '#1a3a5f' }}>FacturAPP</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '14px', color: '#6c757d' }}>{userName}</span>
        <div 
          style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: '#1a3a5f', 
            borderRadius: '50%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            color: 'white' 
          }}
        >
          {userInitials}
        </div>
      </div>
    </div>
  );
};

export default Header;
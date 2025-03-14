import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { dashboardService } from '../services/mockApi';
import { formatDate } from '../utils/formatters';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getNotifications(50); // Obtener todas las notificaciones
        setNotifications(data);
      } catch (err) {
        setError('Error al cargar las notificaciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);

  const markAllAsRead = () => {
    // Aquí se implementaría la lógica para marcar todas como leídas
    // En una aplicación real, esto enviaría una solicitud al backend
    console.log('Marcando todas como leídas');
    
    // Simulación
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const toggleReadStatus = (id) => {
    // Aquí se implementaría la lógica para cambiar el estado de lectura
    // En una aplicación real, esto enviaría una solicitud al backend
    console.log('Cambiando estado de lectura de notificación', id);
    
    // Simulación
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: !notification.read } 
        : notification
    ));
  };

  const deleteNotification = (id) => {
    // Aquí se implementaría la lógica para eliminar una notificación
    // En una aplicación real, esto enviaría una solicitud al backend
    console.log('Eliminando notificación', id);
    
    // Simulación
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getTypeClassName = (type) => {
    switch (type) {
      case 'WARNING':
        return 'warning';
      case 'DANGER':
        return 'danger';
      default:
        return '';
    }
  };

  return (
    <Layout title="Notificaciones">
      <div className="card" style={{ margin: '0 20px 20px 20px' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>
        ) : error ? (
          <div style={{ padding: '20px', color: 'red' }}>{error}</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>No tienes notificaciones</div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
              <button 
                className="btn btn-outline"
                onClick={markAllAsRead}
              >
                Marcar todas como leídas
              </button>
            </div>
            
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification ${getTypeClassName(notification.type)}`}
                style={{ 
                  marginBottom: '10px',
                  backgroundColor: notification.read ? '#f8f9fa' : '#fff',
                  opacity: notification.read ? 0.8 : 1
                }}
              >
                <div className="notification-header">
                  <div className="notification-title">{notification.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="notification-date">{formatDate(notification.date)}</div>
                    <button 
                      onClick={() => toggleReadStatus(notification.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                      title={notification.read ? 'Marcar como no leída' : 'Marcar como leída'}
                    >
                      {notification.read ? '📭' : '📬'}
                    </button>
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                      title="Eliminar notificación"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p>{notification.message}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
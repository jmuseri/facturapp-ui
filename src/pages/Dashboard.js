import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Modal from '../components/common/Modal';
import { dashboardService } from '../services/mockApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import InvoiceForm from '../components/invoices/InvoiceForm';
import RecurringInvoiceForm from '../components/invoices/RecurringInvoiceForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [billingData, setBillingData] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [upcomingInvoices, setUpcomingInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [billingData, recentInvoices, notifications, upcomingInvoices] = await Promise.all([
          dashboardService.getBillingData(),
          dashboardService.getRecentInvoices(3),
          dashboardService.getNotifications(3),
          dashboardService.getUpcomingRecurring(2)
        ]);

        setBillingData(billingData);
        setRecentInvoices(recentInvoices);
        setNotifications(notifications);
        setUpcomingInvoices(upcomingInvoices);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleNewInvoice = () => {
    navigate('/invoices/new');
  };

  const handleInvoiceClick = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Cargando datos...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div id="dashboard-panel" className="panel active">
        <div className="card">
          <h3>Facturación Anual</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {formatCurrency(billingData.currentBilled)}
              </span>
              <span style={{ color: '#6c757d', marginLeft: '5px' }}>
                / {formatCurrency(billingData.annualLimit)}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '14px', color: '#6c757d' }}>
                Categoría {billingData.category}
              </span>
              <div style={{ color: '#198754', fontWeight: 'bold', fontSize: '14px' }}>
                {billingData.percentageUsed}% utilizado
              </div>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className={`progress ${billingData.percentageUsed > 85 ? 'warning' : ''}`}
                style={{ width: `${billingData.percentageUsed}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="card-actions">
          <button className="btn btn-primary" onClick={handleNewInvoice}>
            📄 Nueva Factura
          </button>
          <button className="btn btn-outline" onClick={() => openModal('recurring')}>
            🔄 Programar Factura
          </button>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Facturas Recientes</h3>
          <div className="card">
            {recentInvoices.length > 0 ? (
              <ul className="invoice-list">
                {recentInvoices.map(invoice => (
                  <li 
                    key={invoice.id} 
                    className="invoice-item"
                    onClick={() => handleInvoiceClick(invoice.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{invoice.invoiceNumber}</div>
                      <div style={{ fontSize: '14px', color: '#6c757d' }}>
                        Cliente: {invoice.clientName}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold' }}>{formatCurrency(invoice.totalAmount)}</div>
                      <div className={`status-pill ${invoice.status.toLowerCase()}`}>
                        {invoice.status === 'SENT' ? 'Enviada' : 'Pendiente'}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ padding: '15px', textAlign: 'center' }}>
                No hay facturas recientes
              </div>
            )}
          </div>
        </div>
        
        <div className="grid" style={{ marginTop: '20px' }}>
          <div className="card">
            <h3>Notificaciones</h3>
            {notifications.length > 0 ? (
              <div style={{ marginTop: '15px' }}>
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification ${notification.type.toLowerCase()}`}
                    style={{ marginBottom: '10px' }}
                  >
                    <div className="notification-header">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-date">{formatDate(notification.date)}</div>
                    </div>
                    <p>{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '15px', textAlign: 'center', marginTop: '15px' }}>
                No hay notificaciones
              </div>
            )}
          </div>
          
          <div className="card">
            <h3>Próximas Facturas Programadas</h3>
            {upcomingInvoices.length > 0 ? (
              <div style={{ marginTop: '15px' }}>
                {upcomingInvoices.map(invoice => (
                  <div 
                    key={invoice.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '10px',
                      borderBottom: invoice.id !== upcomingInvoices[upcomingInvoices.length - 1].id ? '1px solid #eaeaea' : 'none',
                      paddingBottom: '10px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{invoice.description}</div>
                      <div style={{ fontSize: '14px', color: '#6c757d' }}>
                        Cliente: {invoice.clientName}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold' }}>{formatCurrency(invoice.amount)}</div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        {formatDate(invoice.nextDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '15px', textAlign: 'center', marginTop: '15px' }}>
                No hay facturas programadas
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal para nueva factura recurrente */}
      <Modal 
        isOpen={modalOpen && modalType === 'recurring'} 
        onClose={() => setModalOpen(false)}
        title="Programar Factura Recurrente"
      >
        <RecurringInvoiceForm 
          onSubmit={() => {
            setModalOpen(false);
            // Recargar datos
            dashboardService.getUpcomingRecurring(2).then(setUpcomingInvoices);
          }}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
};

export default Dashboard;

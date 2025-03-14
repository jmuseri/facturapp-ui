import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Modal from '../components/common/Modal';
import RecurringInvoiceForm from '../components/invoices/RecurringInvoiceForm';
import { invoiceService } from '../services/mockApi';
import { formatCurrency, formatDate } from '../utils/formatters';

const Invoices = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all-invoices');
  const [invoices, setInvoices] = useState([]);
  const [recurringInvoices, setRecurringInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar facturas
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const filters = {};
        
        if (activeTab === 'pending-invoices') {
          filters.status = 'PENDING';
        } else if (activeTab === 'sent-invoices') {
          filters.status = 'SENT';
        }
        
        const [invoicesData, recurringData] = await Promise.all([
          invoiceService.getInvoices(filters),
          activeTab === 'recurring-invoices' ? invoiceService.getRecurringInvoices() : []
        ]);
        
        setInvoices(invoicesData);
        if (activeTab === 'recurring-invoices') {
          setRecurringInvoices(recurringData);
        }
      } catch (err) {
        setError('Error al cargar las facturas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, [activeTab]);

  // Filtrar facturas por término de búsqueda
  const getFilteredInvoices = () => {
    if (!searchTerm) return activeTab === 'recurring-invoices' ? recurringInvoices : invoices;
    
    const term = searchTerm.toLowerCase();
    
    if (activeTab === 'recurring-invoices') {
      return recurringInvoices.filter(
        inv => inv.description.toLowerCase().includes(term) || 
               inv.clientName.toLowerCase().includes(term)
      );
    }
    
    return invoices.filter(
      inv => inv.invoiceNumber.toLowerCase().includes(term) || 
             inv.clientName.toLowerCase().includes(term)
    );
  };

  // Cambiar pestaña activa
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSearchTerm('');
  };

  // Abrir modal para agregar factura recurrente
  const openRecurringModal = (invoice = null) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  // Manejar envío de factura
  const handleSendInvoice = async (id) => {
    try {
      await invoiceService.sendInvoice(id);
      // Recargar facturas para reflejar el cambio
      const updatedInvoices = await invoiceService.getInvoices();
      setInvoices(updatedInvoices);
    } catch (err) {
      console.error('Error al enviar la factura:', err);
    }
  };

  // Manejar toggle de factura recurrente
  const handleToggleRecurring = async (id, currentActive) => {
    try {
      await invoiceService.toggleRecurringInvoice(id, !currentActive);
      // Recargar facturas recurrentes
      const updatedRecurring = await invoiceService.getRecurringInvoices();
      setRecurringInvoices(updatedRecurring);
    } catch (err) {
      console.error('Error al cambiar estado de factura recurrente:', err);
    }
  };

  // Manejar eliminación de factura recurrente
  const handleDeleteRecurring = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta factura recurrente?')) {
      try {
        await invoiceService.deleteRecurringInvoice(id);
        // Recargar facturas recurrentes
        const updatedRecurring = await invoiceService.getRecurringInvoices();
        setRecurringInvoices(updatedRecurring);
      } catch (err) {
        console.error('Error al eliminar factura recurrente:', err);
      }
    }
  };

  return (
    <Layout title="Gestión de Facturas">
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'all-invoices' ? 'active' : ''}`} 
          onClick={() => handleTabClick('all-invoices')}
        >
          Todas
        </div>
        <div 
          className={`tab ${activeTab === 'pending-invoices' ? 'active' : ''}`} 
          onClick={() => handleTabClick('pending-invoices')}
        >
          Pendientes
        </div>
        <div 
          className={`tab ${activeTab === 'sent-invoices' ? 'active' : ''}`} 
          onClick={() => handleTabClick('sent-invoices')}
        >
          Enviadas
        </div>
        <div 
          className={`tab ${activeTab === 'recurring-invoices' ? 'active' : ''}`} 
          onClick={() => handleTabClick('recurring-invoices')}
        >
          Recurrentes
        </div>
      </div>
      
      <div className="tab-content active">
        <div className="card" style={{ margin: '0 20px 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Buscar facturas..." 
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline">🔍</button>
            </div>
            {activeTab === 'recurring-invoices' ? (
              <button 
                className="btn btn-primary" 
                onClick={() => openRecurringModal()}
              >
                + Agregar Recurrente
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/invoices/new')}
              >
                + Nueva Factura
              </button>
            )}
          </div>
          
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>
          ) : error ? (
            <div style={{ padding: '20px', color: 'red' }}>{error}</div>
          ) : activeTab === 'recurring-invoices' ? (
            // Tabla de facturas recurrentes
            <table>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cliente</th>
                  <th>Frecuencia</th>
                  <th>Próxima emisión</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredInvoices().length > 0 ? (
                  getFilteredInvoices().map(invoice => (
                    <tr key={invoice.id}>
                      <td>{invoice.description}</td>
                      <td>{invoice.clientName}</td>
                      <td>
                        {invoice.frequency === 'MONTHLY' ? 'Mensual' :
                         invoice.frequency === 'BIWEEKLY' ? 'Quincenal' :
                         invoice.frequency === 'QUARTERLY' ? 'Trimestral' : invoice.frequency}
                      </td>
                      <td>{formatDate(invoice.nextDate)}</td>
                      <td>{formatCurrency(invoice.amount)}</td>
                      <td>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={invoice.active} 
                            onChange={() => handleToggleRecurring(invoice.id, invoice.active)}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                      <td className="action-buttons">
                        <button 
                          className="action-btn"
                          onClick={() => openRecurringModal(invoice)}
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn"
                          onClick={() => handleDeleteRecurring(invoice.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      No hay facturas recurrentes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // Tabla de facturas normales
            <table>
              <thead>
                <tr>
                  <th>Nº Factura</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredInvoices().length > 0 ? (
                  getFilteredInvoices().map(invoice => (
                    <tr key={invoice.id}>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.clientName}</td>
                      <td>{formatDate(invoice.date)}</td>
                      <td>{formatCurrency(invoice.totalAmount)}</td>
                      <td>
                        <span className={`status-pill ${invoice.status.toLowerCase()}`}>
                          {invoice.status === 'SENT' ? 'Enviada' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button 
                          className="action-btn"
                          onClick={() => navigate(`/invoices/${invoice.id}`)}
                        >
                          👁️
                        </button>
                        {invoice.status === 'PENDING' && (
                          <button 
                            className="action-btn"
                            onClick={() => handleSendInvoice(invoice.id)}
                          >
                            📤
                          </button>
                        )}
                        <button className="action-btn">🖨️</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      No hay facturas disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Modal para facturas recurrentes */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={selectedInvoice ? "Editar Factura Recurrente" : "Programar Factura Recurrente"}
      >
        <RecurringInvoiceForm 
          initialValues={selectedInvoice}
          onSubmit={() => {
            setModalOpen(false);
            // Recargar facturas recurrentes
            invoiceService.getRecurringInvoices().then(setRecurringInvoices);
          }}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
};

export default Invoices;
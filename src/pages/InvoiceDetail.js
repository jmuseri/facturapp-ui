import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { invoiceService, clientService } from '../services/mockApi';
import { formatCurrency, formatDate } from '../utils/formatters';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setLoading(true);
      try {
        const invoiceData = await invoiceService.getInvoiceById(id);
        setInvoice(invoiceData);
        
        if (invoiceData.clientId) {
          const clientData = await clientService.getClientById(invoiceData.clientId);
          setClient(clientData);
        }
      } catch (err) {
        setError('Error al cargar los datos de la factura');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoiceData();
  }, [id]);

  const handleSendInvoice = async () => {
    try {
      await invoiceService.sendInvoice(id);
      // Recargar los datos de la factura
      const updatedInvoice = await invoiceService.getInvoiceById(id);
      setInvoice(updatedInvoice);
    } catch (err) {
      console.error('Error al enviar la factura:', err);
    }
  };

  if (loading) {
    return (
      <Layout title="Detalle de Factura">
        <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>
      </Layout>
    );
  }

  if (error || !invoice) {
    return (
      <Layout title="Detalle de Factura">
        <div style={{ padding: '20px', color: 'red' }}>
          {error || 'No se encontró la factura'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Factura ${invoice.invoiceNumber}`}>
      <div className="card" style={{ margin: '0 20px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h3 style={{ marginBottom: '5px' }}>Factura {invoice.invoiceNumber}</h3>
            <span className={`status-pill ${invoice.status.toLowerCase()}`} style={{ display: 'inline-block', marginBottom: '10px' }}>
              {invoice.status === 'SENT' ? 'Enviada' : 'Pendiente'}
            </span>
            <p>Fecha: {formatDate(invoice.date)}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {invoice.status === 'PENDING' && (
              <button className="btn btn-primary" onClick={handleSendInvoice}>
                📤 Enviar Factura
              </button>
            )}
            <button className="btn btn-outline">
              🖨️ Imprimir
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/invoices')}
            >
              Volver
            </button>
          </div>
        </div>
        
        <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eaeaea' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h4 style={{ marginBottom: '10px' }}>Cliente</h4>
            <p style={{ margin: '5px 0' }}><strong>Nombre:</strong> {client?.name || invoice.clientName}</p>
            {client && (
              <>
                <p style={{ margin: '5px 0' }}><strong>CUIT:</strong> {client.cuit}</p>
                <p style={{ margin: '5px 0' }}><strong>Email:</strong> {client.email}</p>
                <p style={{ margin: '5px 0' }}><strong>Teléfono:</strong> {client.phone}</p>
              </>
            )}
          </div>
          <div>
            <h4 style={{ marginBottom: '10px' }}>Factura</h4>
            <p style={{ margin: '5px 0' }}><strong>Concepto:</strong> {invoice.concept}</p>
            <p style={{ margin: '5px 0' }}><strong>Tipo:</strong> Factura C</p>
            {invoice.afip_cae && (
              <>
                <p style={{ margin: '5px 0' }}><strong>CAE:</strong> {invoice.afip_cae}</p>
                <p style={{ margin: '5px 0' }}><strong>Vto. CAE:</strong> {formatDate(invoice.afip_cae_expiry)}</p>
              </>
            )}
          </div>
        </div>
        
        <h4 style={{ marginBottom: '10px' }}>Ítems</h4>
        <table style={{ width: '100%', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Descripción</th>
              <th style={{ textAlign: 'right' }}>Cantidad</th>
              <th style={{ textAlign: 'right' }}>Precio Unitario</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold', padding: '10px 0' }}>
                Total
              </td>
              <td style={{ textAlign: 'right', fontWeight: 'bold', padding: '10px 0' }}>
                {formatCurrency(invoice.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
        
        <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eaeaea' }} />
        
        <div>
          <h4 style={{ marginBottom: '10px' }}>Método de envío</h4>
          <div style={{ display: 'flex', gap: '20px' }}>
            <p>
              <strong>Email:</strong> {invoice.sendByEmail ? '✓' : '✗'}
              {invoice.sendByEmail && invoice.status === 'SENT' && ' (Enviado)'}
            </p>
            <p>
              <strong>WhatsApp:</strong> {invoice.sendByWhatsapp ? '✓' : '✗'}
              {invoice.sendByWhatsapp && invoice.status === 'SENT' && ' (Enviado)'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceDetail;
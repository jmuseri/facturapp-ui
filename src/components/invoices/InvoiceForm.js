import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import Layout from '../common/Layout';
import { clientService, invoiceService } from '../../services/mockApi';
import { formatCurrency } from '../../utils/formatters';

// Esquema de validación para la factura
const InvoiceSchema = Yup.object().shape({
  clientId: Yup.string().required('Debes seleccionar un cliente'),
  date: Yup.date().required('La fecha es requerida'),
  concept: Yup.string().required('El concepto es requerido'),
  items: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().required('La descripción es requerida'),
      quantity: Yup.number()
        .required('La cantidad es requerida')
        .positive('La cantidad debe ser positiva'),
      unitPrice: Yup.number()
        .required('El precio unitario es requerido')
        .positive('El precio debe ser positivo')
    })
  ).min(1, 'Debe haber al menos un ítem'),
  sendByEmail: Yup.boolean(),
  sendByWhatsapp: Yup.boolean()
});

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [clients, setClients] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar clientes y factura (si es modo edición)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const clientsData = await clientService.getClients();
        setClients(clientsData);
        
        if (isEditMode) {
          const invoiceData = await invoiceService.getInvoiceById(id);
          setInvoice(invoiceData);
        }
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);

  // Valores iniciales para el formulario
  const getInitialValues = () => {
    if (isEditMode && invoice) {
      return {
        clientId: invoice.clientId.toString(),
        date: invoice.date,
        concept: invoice.concept,
        items: invoice.items,
        sendByEmail: true,
        sendByWhatsapp: false
      };
    }
    
    return {
      clientId: '',
      date: new Date().toISOString().split('T')[0],
      concept: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
      sendByEmail: true,
      sendByWhatsapp: false
    };
  };

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Calcular totales
      const items = values.items.map(item => ({
        ...item,
        total: item.quantity * item.unitPrice
      }));
      
      const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
      
      const invoiceData = {
        ...values,
        items,
        totalAmount,
        clientName: clients.find(c => c.id === parseInt(values.clientId))?.name || ''
      };
      
      if (isEditMode) {
        await invoiceService.updateInvoice(id, invoiceData);
      } else {
        await invoiceService.createInvoice(invoiceData);
      }
      
      navigate('/invoices');
    } catch (err) {
      setError('Error al guardar la factura');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title={isEditMode ? 'Editar Factura' : 'Nueva Factura'}>
        <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title={isEditMode ? 'Editar Factura' : 'Nueva Factura'}>
        <div style={{ padding: '20px', color: 'red' }}>{error}</div>
      </Layout>
    );
  }

  return (
    <Layout title={isEditMode ? 'Editar Factura' : 'Nueva Factura'}>
      <div className="card" style={{ margin: '0 20px 20px 20px' }}>
        <Formik
          initialValues={getInitialValues()}
          validationSchema={InvoiceSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="input-group">
                <label htmlFor="clientId">Cliente</label>
                <Field as="select" id="clientId" name="clientId">
                  <option value="">Seleccionar cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="clientId" component="div" className="error-message visible" />
              </div>
              
              <div className="input-group">
                <label htmlFor="date">Fecha</label>
                <Field type="date" id="date" name="date" />
                <ErrorMessage name="date" component="div" className="error-message visible" />
              </div>
              
              <div className="input-group">
                <label htmlFor="concept">Concepto</label>
                <Field type="text" id="concept" name="concept" placeholder="Descripción del servicio o producto" />
                <ErrorMessage name="concept" component="div" className="error-message visible" />
              </div>
              
              <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Ítems de la factura</h4>
              
              <FieldArray name="items">
                {({ remove, push }) => (
                  <div>
                    {values.items.length > 0 &&
                      values.items.map((item, index) => (
                        <div key={index} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <h5 style={{ margin: 0 }}>Ítem #{index + 1}</h5>
                            {values.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                style={{ background: 'none', border: 'none', color: '#DC3545', cursor: 'pointer' }}
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                          
                          <div className="input-group">
                            <label htmlFor={`items.${index}.description`}>Descripción</label>
                            <Field
                              name={`items.${index}.description`}
                              placeholder="Descripción del ítem"
                              type="text"
                            />
                            <ErrorMessage
                              name={`items.${index}.description`}
                              component="div"
                              className="error-message visible"
                            />
                          </div>
                          
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div className="input-group" style={{ flex: 1 }}>
                              <label htmlFor={`items.${index}.quantity`}>Cantidad</label>
                              <Field
                                name={`items.${index}.quantity`}
                                placeholder="Cantidad"
                                type="number"
                                min="1"
                                onChange={(e) => {
                                  const value = parseInt(e.target.value, 10) || 0;
                                  setFieldValue(`items.${index}.quantity`, value);
                                  const unitPrice = values.items[index].unitPrice || 0;
                                  setFieldValue(`items.${index}.total`, value * unitPrice);
                                }}
                              />
                              <ErrorMessage
                                name={`items.${index}.quantity`}
                                component="div"
                                className="error-message visible"
                              />
                            </div>
                            
                            <div className="input-group" style={{ flex: 1 }}>
                              <label htmlFor={`items.${index}.unitPrice`}>Precio unitario</label>
                              <Field
                                name={`items.${index}.unitPrice`}
                                placeholder="Precio unitario"
                                type="number"
                                min="0"
                                step="0.01"
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  setFieldValue(`items.${index}.unitPrice`, value);
                                  const quantity = values.items[index].quantity || 0;
                                  setFieldValue(`items.${index}.total`, quantity * value);
                                }}
                              />
                              <ErrorMessage
                                name={`items.${index}.unitPrice`}
                                component="div"
                                className="error-message visible"
                              />
                            </div>
                            
                            <div className="input-group" style={{ flex: 1 }}>
                              <label>Total</label>
                              <div style={{ 
                                padding: '10px', 
                                border: '1px solid #ddd', 
                                borderRadius: '5px', 
                                backgroundColor: '#f0f0f0'
                              }}>
                                {formatCurrency(values.items[index].quantity * values.items[index].unitPrice)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => push({ description: '', quantity: 1, unitPrice: 0, total: 0 })}
                      style={{ marginBottom: '20px' }}
                    >
                      + Agregar ítem
                    </button>
                    
                    <div style={{ 
                      marginTop: '20px', 
                      padding: '15px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '5px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h4 style={{ margin: 0 }}>Total Factura:</h4>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {formatCurrency(
                          values.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </FieldArray>
              
              <div className="input-group" style={{ marginTop: '20px' }}>
                <label>Método de envío</label>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  <div>
                    <Field type="checkbox" id="sendByEmail" name="sendByEmail" />
                    <label htmlFor="sendByEmail" style={{ marginLeft: '5px' }}>Email</label>
                  </div>
                  <div>
                    <Field type="checkbox" id="sendByWhatsapp" name="sendByWhatsapp" />
                    <label htmlFor="sendByWhatsapp" style={{ marginLeft: '5px' }}>WhatsApp</label>
                  </div>
                </div>
                {!values.sendByEmail && !values.sendByWhatsapp && (
                  <div className="error-message visible">Selecciona al menos un método de envío</div>
                )}
              </div>
              
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/invoices')}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar Factura' : 'Generar Factura'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default InvoiceForm;
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { clientService, invoiceService } from '../../services/mockApi';

// Esquema de validación para facturas recurrentes
const RecurringInvoiceSchema = Yup.object().shape({
  description: Yup.string().required('La descripción es requerida'),
  clientId: Yup.string().required('Debes seleccionar un cliente'),
  amount: Yup.number()
    .required('El monto es requerido')
    .positive('El monto debe ser positivo'),
  frequency: Yup.string().required('La frecuencia es requerida'),
  startDate: Yup.date().required('La fecha de inicio es requerida'),
  concept: Yup.string().required('El concepto es requerido'),
  sendByEmail: Yup.boolean(),
  sendByWhatsapp: Yup.boolean()
});

const RecurringInvoiceForm = ({ onSubmit, onCancel, initialValues }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar clientes
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await clientService.getClients();
        setClients(clientsData);
      } catch (err) {
        setError('Error al cargar los clientes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, []);

  // Valores iniciales del formulario
  const getInitialValues = () => {
    if (initialValues) {
      return {
        ...initialValues,
        clientId: initialValues.clientId.toString()
      };
    }
    
    return {
      description: '',
      clientId: '',
      amount: '',
      frequency: 'MONTHLY',
      startDate: new Date().toISOString().split('T')[0],
      concept: '',
      sendByEmail: true,
      sendByWhatsapp: false
    };
  };

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const recurringData = {
        ...values,
        clientName: clients.find(c => c.id === parseInt(values.clientId))?.name || '',
        nextDate: values.startDate,
        active: true
      };
      
      // Si hay valores iniciales, estamos editando
      if (initialValues) {
        await invoiceService.updateRecurringInvoice(initialValues.id, recurringData);
      } else {
        await invoiceService.createRecurringInvoice(recurringData);
      }
      
      if (onSubmit) onSubmit();
    } catch (err) {
      setError('Error al guardar la factura recurrente');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={RecurringInvoiceSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form id="recurring-form">
          <div className="input-group">
            <label htmlFor="description">Descripción</label>
            <Field 
              type="text" 
              id="description" 
              name="description" 
              placeholder="Ej: Servicio Mensual de Diseño" 
            />
            <ErrorMessage name="description" component="div" className="error-message visible" />
          </div>
          
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
            <label htmlFor="amount">Monto</label>
            <Field 
              type="number" 
              id="amount" 
              name="amount" 
              placeholder="0.00" 
              min="0.01" 
              step="0.01" 
            />
            <ErrorMessage name="amount" component="div" className="error-message visible" />
          </div>
          
          <div className="input-group">
            <label htmlFor="frequency">Frecuencia</label>
            <Field as="select" id="frequency" name="frequency">
              <option value="">Seleccionar frecuencia</option>
              <option value="MONTHLY">Mensual</option>
              <option value="BIWEEKLY">Quincenal</option>
              <option value="QUARTERLY">Trimestral</option>
            </Field>
            <ErrorMessage name="frequency" component="div" className="error-message visible" />
          </div>
          
          <div className="input-group">
            <label htmlFor="startDate">Fecha de inicio</label>
            <Field type="date" id="startDate" name="startDate" />
            <ErrorMessage name="startDate" component="div" className="error-message visible" />
          </div>
          
          <div className="input-group">
            <label htmlFor="concept">Concepto</label>
            <Field 
              type="text" 
              id="concept" 
              name="concept" 
              placeholder="Descripción del servicio o producto" 
            />
            <ErrorMessage name="concept" component="div" className="error-message visible" />
          </div>
          
          <div className="input-group">
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
          
          {error && (
            <div className="error-message visible" style={{ marginBottom: "15px" }}>
              {error}
            </div>
          )}
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : initialValues ? 'Actualizar' : 'Programar Factura'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RecurringInvoiceForm;
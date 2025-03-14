 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Modal from '../components/common/Modal';
import { clientService } from '../services/mockApi';
import { isValidCuit, isValidEmail } from '../utils/validators';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Esquema de validación para clientes
const ClientSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  cuit: Yup.string()
    .required('El CUIT es requerido')
    .test('is-valid-cuit', 'CUIT inválido (formato: XX-XXXXXXXX-X)', isValidCuit),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  phone: Yup.string().required('El teléfono es requerido'),
  address: Yup.string()
});

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar clientes
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
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

  // Filtrar clientes por término de búsqueda
  const getFilteredClients = () => {
    if (!searchTerm) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(
      client => client.name.toLowerCase().includes(term) || 
                client.cuit.includes(term) ||
                client.email.toLowerCase().includes(term)
    );
  };

  // Abrir modal para agregar/editar cliente
  const openClientModal = (client = null) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (selectedClient) {
        await clientService.updateClient(selectedClient.id, values);
      } else {
        await clientService.createClient(values);
      }
      
      // Recargar clientes
      const updatedClients = await clientService.getClients();
      setClients(updatedClients);
      
      setModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error al guardar cliente:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Manejar eliminación de cliente
  const handleDeleteClient = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await clientService.deleteClient(id);
        // Recargar clientes
        const updatedClients = await clientService.getClients();
        setClients(updatedClients);
      } catch (err) {
        console.error('Error al eliminar cliente:', err);
      }
    }
  };

  return (
    <Layout title="Clientes">
      <div className="card" style={{ margin: '0 20px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Buscar clientes..." 
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline">🔍</button>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => openClientModal()}
          >
            + Nuevo Cliente
          </button>
        </div>
        
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>
        ) : error ? (
          <div style={{ padding: '20px', color: 'red' }}>{error}</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre/Razón social</th>
                <th>CUIT/CUIL</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredClients().length > 0 ? (
                getFilteredClients().map(client => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.cuit}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td className="action-buttons">
                      <button 
                        className="action-btn"
                        onClick={() => openClientModal(client)}
                        title="Ver detalles"
                      >
                        👁️
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => openClientModal(client)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => handleDeleteClient(client.id)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    No se encontraron clientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Modal para crear/editar cliente */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={selectedClient ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <Formik
          initialValues={selectedClient || {
            name: '',
            cuit: '',
            email: '',
            phone: '',
            address: ''
          }}
          validationSchema={ClientSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form id="client-form">
              <div className="input-group">
                <label htmlFor="name">Nombre/Razón Social</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" className="error-message visible" />
              </div>
              
              <div className="input-group">
                <label htmlFor="cuit">CUIT/CUIL</label>
                <Field 
                  type="text" 
                  id="cuit" 
                  name="cuit" 
                  placeholder="XX-XXXXXXXX-X" 
                />
                <ErrorMessage name="cuit" component="div" className="error-message visible" />
              </div>
              
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" className="error-message visible" />
              </div>
              
              <div className="input-group">
                <label htmlFor="phone">Teléfono</label>
                <Field type="tel" id="phone" name="phone" />
                <ErrorMessage name="phone" component="div" className="error-message visible" />
              </div>
              
              <div className="input-group">
                <label htmlFor="address">Dirección</label>
                <Field type="text" id="address" name="address" />
                <ErrorMessage name="address" component="div" className="error-message visible" />
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : selectedClient ? 'Actualizar' : 'Guardar Cliente'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </Layout>
  );
};

export default Clients;
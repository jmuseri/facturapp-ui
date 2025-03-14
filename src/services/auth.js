import API from './api';

export const login = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  // Opcionalmente notificar al backend
  return API.post('/auth/logout');
};

export const getCurrentUser = async () => {
  try {
    const response = await API.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Error en el servidor');
  }
}; 

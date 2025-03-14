import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('Campo requerido'),
  password: Yup.string()
    .required('Campo requerido')
});

const Login = () => {
  const { login, error: authError, loading } = useAuth();
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values.email, values.password);
      // La redirección la maneja el componente Route en App.js
    } catch (error) {
      setLoginError(error.message || 'Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      // Simulación de login biométrico
      await login('demo@facturapp.com', 'password');
    } catch (error) {
      setLoginError('Error con la autenticación biométrica');
    }
  };

  return (
    <div id="login-screen" className="screen active-screen">
      <div className="login-container">
        <div className="logo-container">
          <div className="logo">FacturAPP</div>
          <p style={{ color: '#6c757d' }}>Tu asistente de facturación</p>
        </div>
        <div className="login-card">
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Ingresar</h2>
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form id="login-form">
                <div className="input-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <Field 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="ejemplo@correo.com" 
                    className={errors.email && touched.email ? 'invalid' : ''}
                  />
                  <ErrorMessage name="email" component="div" className="error-message visible" />
                </div>
                
                <div className="input-group">
                  <label htmlFor="password">Contraseña</label>
                  <Field 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Tu contraseña" 
                    className={errors.password && touched.password ? 'invalid' : ''}
                  />
                  <ErrorMessage name="password" component="div" className="error-message visible" />
                </div>
                
                {(loginError || authError) && (
                  <div className="error-message visible">
                    {loginError || authError}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
              </Form>
            )}
          </Formik>
          
          <div className="biometric-login">
            <p>O ingresar con huella dactilar</p>
            <div 
              className="fingerprint-icon" 
              onClick={handleBiometricLogin}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              👆
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
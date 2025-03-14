import {
    currentUser,
    billingData,
    clients,
    invoices,
    recurringInvoices,
    notifications,
    subscriptionPlans
  } from './mockData';
  
  // Simular delay de red
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Auth services
  export const authService = {
    login: async (email, password) => {
      await delay(700);
      if (email === 'demo@facturapp.com' && password === 'password') {
        const token = 'mock-jwt-token';
        localStorage.setItem('token', token);
        return { user: currentUser, token };
      }
      throw new Error('Credenciales inválidas');
    },
    
    register: async (userData) => {
      await delay(1000);
      return { user: { ...currentUser, ...userData }, token: 'mock-jwt-token' };
    },
    
    getCurrentUser: async () => {
      await delay(500);
      return currentUser;
    },
    
    logout: async () => {
      await delay(300);
      localStorage.removeItem('token');
      return { success: true };
    }
  };
  
  // Client services
  export const clientService = {
    getClients: async () => {
      await delay(600);
      return clients;
    },
    
    getClientById: async (id) => {
      await delay(400);
      const client = clients.find(c => c.id === parseInt(id));
      if (!client) throw new Error('Cliente no encontrado');
      return client;
    },
    
    createClient: async (clientData) => {
      await delay(800);
      const newClient = {
        id: clients.length + 1,
        ...clientData
      };
      return newClient;
    },
    
    updateClient: async (id, clientData) => {
      await delay(700);
      return { id: parseInt(id), ...clientData };
    },
    
    deleteClient: async (id) => {
      await delay(500);
      return { success: true };
    }
  };
  
  // Invoice services
  export const invoiceService = {
    getInvoices: async (filters = {}) => {
      await delay(700);
      let filteredInvoices = [...invoices];
      
      // Aplicar filtros si existen
      if (filters.clientId) {
        filteredInvoices = filteredInvoices.filter(inv => inv.clientId === filters.clientId);
      }
      
      if (filters.status) {
        filteredInvoices = filteredInvoices.filter(inv => inv.status === filters.status);
      }
      
      if (filters.dateFrom && filters.dateTo) {
        filteredInvoices = filteredInvoices.filter(inv => {
          const invoiceDate = new Date(inv.date);
          const fromDate = new Date(filters.dateFrom);
          const toDate = new Date(filters.dateTo);
          return invoiceDate >= fromDate && invoiceDate <= toDate;
        });
      }
      
      return filteredInvoices;
    },
    
    getInvoiceById: async (id) => {
      await delay(500);
      const invoice = invoices.find(inv => inv.id === parseInt(id));
      if (!invoice) throw new Error('Factura no encontrada');
      return invoice;
    },
    
    createInvoice: async (invoiceData) => {
      await delay(1000);
      const newInvoice = {
        id: invoices.length + 1,
        invoiceNumber: `C-${String(invoices.length + 1).padStart(5, '0')}`,
        status: 'PENDING',
        ...invoiceData
      };
      return newInvoice;
    },
    
    sendInvoice: async (id) => {
      await delay(800);
      return { id: parseInt(id), status: 'SENT' };
    },
    
    deleteInvoice: async (id) => {
      await delay(600);
      return { success: true };
    },
    
    // Facturas recurrentes
    getRecurringInvoices: async () => {
      await delay(600);
      return recurringInvoices;
    },
    
    createRecurringInvoice: async (recurringData) => {
      await delay(900);
      const newRecurring = {
        id: recurringInvoices.length + 1,
        active: true,
        ...recurringData
      };
      return newRecurring;
    },
    
    updateRecurringInvoice: async (id, data) => {
      await delay(700);
      return { id: parseInt(id), ...data };
    },
    
    toggleRecurringInvoice: async (id, active) => {
      await delay(400);
      return { id: parseInt(id), active };
    },
    
    deleteRecurringInvoice: async (id) => {
      await delay(500);
      return { success: true };
    }
  };
  
  // Dashboard services
  export const dashboardService = {
    getBillingData: async () => {
      await delay(600);
      return billingData;
    },
    
    getRecentInvoices: async (limit = 5) => {
      await delay(500);
      return invoices
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
    },
    
    getNotifications: async (limit = 10) => {
      await delay(400);
      return notifications.slice(0, limit);
    },
    
    getUpcomingRecurring: async (limit = 3) => {
      await delay(500);
      return recurringInvoices
        .filter(rec => rec.active)
        .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
        .slice(0, limit);
    }
  };
  
  // Settings services
  export const settingsService = {
    updateProfile: async (profileData) => {
      await delay(800);
      return { ...currentUser, ...profileData };
    },
    
    updateFiscalData: async (fiscalData) => {
      await delay(900);
      return { ...currentUser, ...fiscalData };
    },
    
    changePassword: async (passwordData) => {
      await delay(700);
      if (passwordData.currentPassword !== 'password') {
        throw new Error('La contraseña actual es incorrecta');
      }
      return { success: true };
    },
    
    updateSecuritySettings: async (securitySettings) => {
      await delay(600);
      return { success: true, ...securitySettings };
    },
    
    updateNotificationPreferences: async (preferences) => {
      await delay(500);
      return { success: true, ...preferences };
    },
    
    getSubscriptionPlans: async () => {
      await delay(600);
      return subscriptionPlans;
    }
  };
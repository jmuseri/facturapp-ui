// Datos de usuario
export const currentUser = {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    cuit: "20-12345678-9",
    monotributoCategory: "B",
    fiscalAddress: "Av. Corrientes 1234, CABA",
    puntoVenta: 1
  };
  
  // Datos de facturación
  export const billingData = {
    annualLimit: 1200000,
    currentBilled: 780500,
    category: "B",
    percentageUsed: 65
  };
  
  // Clientes
  export const clients = [
    { id: 1, name: "Empresa XYZ", cuit: "30-71234567-9", email: "contacto@xyz.com", phone: "11-1234-5678", address: "Av Libertador 123" },
    { id: 2, name: "Comercial ABC", cuit: "30-98765432-1", email: "ventas@abc.com", phone: "11-9876-5432", address: "Callao 456" },
    { id: 3, name: "Distribuidora Norte", cuit: "30-45678912-3", email: "info@norte.com.ar", phone: "351-789-4561", address: "Córdoba 789" },
    { id: 4, name: "Consultora Sur", cuit: "30-36985214-7", email: "admin@sur.com.ar", phone: "341-852-9637", address: "Balcarce 234" },
    { id: 5, name: "Estudio Jurídico", cuit: "30-95175369-8", email: "juridico@estudio.com", phone: "11-4567-8901", address: "Lavalle 567" }
  ];
  
  // Facturas
  export const invoices = [
    { 
      id: 1, 
      invoiceNumber: "C-00001", 
      clientId: 1, 
      clientName: "Empresa XYZ", 
      date: "2025-02-15", 
      concept: "Servicios de consultoría", 
      totalAmount: 25000, 
      status: "SENT",
      items: [
        { id: 1, description: "Consultoría técnica", quantity: 10, unitPrice: 2000, total: 20000 },
        { id: 2, description: "Soporte remoto", quantity: 5, unitPrice: 1000, total: 5000 }
      ]
    },
    { 
      id: 2, 
      invoiceNumber: "C-00002", 
      clientId: 2, 
      clientName: "Comercial ABC", 
      date: "2025-02-20", 
      concept: "Desarrollo de software", 
      totalAmount: 18500, 
      status: "PENDING",
      items: [
        { id: 3, description: "Desarrollo frontend", quantity: 1, unitPrice: 10000, total: 10000 },
        { id: 4, description: "Configuración servidor", quantity: 1, unitPrice: 8500, total: 8500 }
      ]
    },
    { 
      id: 3, 
      invoiceNumber: "C-00003", 
      clientId: 3, 
      clientName: "Distribuidora Norte", 
      date: "2025-02-25", 
      concept: "Asesoría logística", 
      totalAmount: 32200, 
      status: "SENT",
      items: [
        { id: 5, description: "Análisis de rutas", quantity: 1, unitPrice: 15000, total: 15000 },
        { id: 6, description: "Optimización de procesos", quantity: 1, unitPrice: 17200, total: 17200 }
      ]
    },
    { 
      id: 4, 
      invoiceNumber: "C-00004", 
      clientId: 4, 
      clientName: "Consultora Sur", 
      date: "2025-02-28", 
      concept: "Servicios de marketing", 
      totalAmount: 45000, 
      status: "SENT",
      items: [
        { id: 7, description: "Campaña digital", quantity: 1, unitPrice: 30000, total: 30000 },
        { id: 8, description: "Diseño gráfico", quantity: 3, unitPrice: 5000, total: 15000 }
      ]
    }
  ];
  
  // Facturas recurrentes
  export const recurringInvoices = [
    { 
      id: 1, 
      description: "Servicio Mensual",
      clientId: 5, 
      clientName: "Estudio Jurídico", 
      concept: "Mantenimiento de sistemas",
      frequency: "MONTHLY", 
      amount: 30000, 
      nextDate: "2025-03-05", 
      active: true,
      sendByEmail: true,
      sendByWhatsapp: false
    },
    { 
      id: 2, 
      description: "Asesoría Técnica",
      clientId: 4, 
      clientName: "Consultora Sur", 
      concept: "Soporte técnico continuo",
      frequency: "MONTHLY", 
      amount: 45000, 
      nextDate: "2025-03-10", 
      active: true,
      sendByEmail: true,
      sendByWhatsapp: true
    }
  ];
  
  // Notificaciones
  export const notifications = [
    { 
      id: 1, 
      title: "Vencimiento Próximo", 
      message: "Tu pago mensual de monotributo vence en 2 días.", 
      type: "WARNING", 
      date: "2025-02-28", 
      read: false 
    },
    { 
      id: 2, 
      title: "Factura Enviada", 
      message: "La factura C-00004 fue enviada exitosamente a Consultora Sur.", 
      type: "INFO", 
      date: "2025-02-28", 
      read: false 
    },
    { 
      id: 3, 
      title: "Factura Programada", 
      message: "Se ha programado una factura recurrente para Estudio Jurídico.", 
      type: "INFO", 
      date: "2025-02-25", 
      read: true 
    },
    { 
      id: 4, 
      title: "Factura Enviada", 
      message: "La factura C-00003 fue enviada exitosamente a Distribuidora Norte.", 
      type: "INFO", 
      date: "2025-02-25", 
      read: true 
    }
  ];
  
  // Planes de suscripción
  export const subscriptionPlans = [
    {
      id: 1,
      name: "Free",
      description: "Plan gratuito con acceso limitado",
      monthlyPrice: 0,
      annualPrice: 0,
      invoicesPerMonth: 3,
      features: [
        "Hasta 3 facturas por mes",
        "Acceso a funcionalidades básicas",
        "Soporte por email"
      ]
    },
    {
      id: 2,
      name: "Premium",
      description: "Plan completo con todas las funcionalidades",
      monthlyPrice: 1500,
      annualPrice: 15000,
      invoicesPerMonth: 999999,
      features: [
        "Facturas ilimitadas",
        "Facturación recurrente",
        "Soporte prioritario",
        "Todas las funcionalidades"
      ]
    }
  ];
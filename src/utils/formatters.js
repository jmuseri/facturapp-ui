// Formatear moneda a pesos argentinos
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Formatear fecha en formato argentino
  export const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };
  
  // Obtener iniciales de un nombre
  export const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substr(0, 2)
      .toUpperCase();
  }; 

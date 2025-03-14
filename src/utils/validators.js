 // Validar CUIT Argentino
export const isValidCuit = (cuit) => {
    const re = /^\d{2}-\d{8}-\d{1}$/;
    return re.test(cuit);
  };
  
  // Validar Email
  export const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

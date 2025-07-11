// Configuration utility for environment variables
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5103',
  
  // Application Settings
  APP_NAME: import.meta.env.VITE_APP_NAME || 'RadiologyCenter',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Development Settings
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === 'true',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: import.meta.env.VITE_AUTH_ENDPOINT || '/auth',
    PATIENTS: import.meta.env.VITE_PATIENTS_ENDPOINT || '/patients',
    APPOINTMENTS: import.meta.env.VITE_APPOINTMENTS_ENDPOINT || '/appointments',
    EXAMINATIONS: import.meta.env.VITE_EXAMINATIONS_ENDPOINT || '/examinations',
    UNITS: import.meta.env.VITE_UNITS_ENDPOINT || '/units',
    INSURANCE_PROVIDERS: import.meta.env.VITE_INSURANCE_PROVIDERS_ENDPOINT || '/insurance-providers',
    CONTRACTS: import.meta.env.VITE_CONTRACTS_ENDPOINT || '/contracts',
    PATIENT_INSURANCE: import.meta.env.VITE_PATIENT_INSURANCE_ENDPOINT || '/patient-insurance',
    PATIENT_CONTRACTS: import.meta.env.VITE_PATIENT_CONTRACTS_ENDPOINT || '/patient-contracts',
    USERS: import.meta.env.VITE_USERS_ENDPOINT || '/users',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${config.API_BASE_URL}${endpoint}`;
};

// Helper function for logging
export const log = (message, data = null) => {
  if (config.ENABLE_LOGGING) {
    if (data) {
      console.log(`[${config.APP_NAME}] ${message}`, data);
    } else {
      console.log(`[${config.APP_NAME}] ${message}`);
    }
  }
};

// Helper function for debug logging
export const debug = (message, data = null) => {
  if (config.DEBUG_MODE) {
    log(`[DEBUG] ${message}`, data);
  }
};

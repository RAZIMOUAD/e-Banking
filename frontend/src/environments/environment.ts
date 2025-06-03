// src/environments/environment.ts


export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8088/api/v1', // URL de votre backend Spring
  version: '1.0.0',
  features: {
    mockData: true, // Active les données fictives en cas d'erreur backend
    realTimeUpdates: true,
    advancedFiltering: true
  }
};

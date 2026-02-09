export const environment = {
  production: true,
  // High-Frequency Transmission Configuration
  hfTransmission: {
    serverUrl: 'wss://hfrt.production.com:8080', // Use WSS (secure) in production
    defaultFrequency: 100, // Hz
    maxDataPoints: 1000,
    reconnectAttempts: 10,
    reconnectDelay: 5000, // ms
  }
};

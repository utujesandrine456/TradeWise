// Export all mock data from a single entry point
export * from './dashboardData';
export * from './stockData';
export * from './historyData';
export * from './buyingData';
export * from './sellingData';
export * from './creditsData';

// Helper functions
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API response helper
export const mockApiResponse = (data, success = true, delayMs = 500) => {
  return delay(delayMs).then(() => ({
    success,
    data: success ? data : null,
    message: success ? 'Operation successful' : 'An error occurred',
    error: !success ? 'Mock error message' : null
  }));
};

import axios from 'axios';


// הגדרת API_URL עם ברירת מחדל
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  checkHealth: async () => {
    const response = await apiClient.get('/health'); // כעת זה ילך ל /api/health
    return response.data;
  },

  // Get all items
 }
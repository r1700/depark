import axios from 'axios';
type Item = any;
type ItemsResponse = any;
type ItemResponse = any;

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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
    const response = await apiClient.get('/health'); 
    return response.data;
  },

  // Get all items
  getItems: async (): Promise<Item[]> => {
    const response = await apiClient.get<ItemsResponse>('/items');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch items');
  },

  // Get specific item
  getItem: async (id: string): Promise<Item> => {
    const response = await apiClient.get<ItemResponse>(`/items/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch item');
  },
};

export const authenticateUser = async (googleToken: string): Promise<{ token: string; user: { id: number; name: string } }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (googleToken === "valid-google-token") {
        resolve({
          token: "mock-jwt-token-123456",
          user: { id: 1, name: "Google User" },
        });
      } else {
        reject(new Error("Invalid Google token"));
      }
    }, 1000);
  });
};


export async function loginWithGoogle(credential: string) {
  console.log('👉 Sending credential to backend:', credential); 

  const res = await fetch(`${API_URL}/auth/google`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: credential }), 
});

  if (!res.ok) {
    const errText = await res.text();
    console.error('User is not registered in the system. Login failed.', errText); 
    throw new Error('User is not registered in the system. Login failed.');

  }

  const data = await res.json();
  console.log('✅ Login success:', data); 
  return data;
}

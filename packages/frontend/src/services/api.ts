import axios from 'axios';


// הגדרת API_URL עם ברירת מחדל
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
//  import axios from 'axios';
 
// // import { Item, ItemsResponse, ItemResponse } from '@base-project/shared';

//  const API_URL = process.env.REACT_APP_API_URL;

// const apiClient = axios.create({
//   baseURL: API_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

//   // Get all items
// const getEmployees = async (): Promise<Object[]> => {
//   try {
//     const response = await apiClient.get('/employees/employeesList');
//     return response.data; // מכיוון ש-axios מחזיר את הנתונים בתוך `data`
//   } catch (error) {
//     console.error('שגיאה בחיבור ל-API:', error);
//     return [];
//   }
// };

// export const apiService = {
//   // Health check
//   checkHealth: async () => {
//     const response = await API_URL.get('/health'); // כעת זה ילך ל /api/health
//     return response.data;
//   },

  // Get all items
 //}
// export {getEmployees}

export{}

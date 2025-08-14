// src/app/pages/adminUser/adminUserAPI.ts
import axios from 'axios';
import { AdminUser,AdminUserFilters } from './adminUserTypes';  // הנתיב לתיאור הטיפוסים שלך

export async function fetchAdminUsersAPI(filters?: AdminUserFilters): Promise<AdminUser[]> {
  const response = await axios.get('/admin/users',{ params: filters });  // וודאי שהנתיב מתאים ל-API שלך
  return response.data.data;  // לפי מבנה ה-API שלך - הנתונים בתוך data.data
}
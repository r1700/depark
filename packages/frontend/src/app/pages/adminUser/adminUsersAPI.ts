import axios from 'axios';
import { CreateAdminUserRequest, AdminUser, AdminUserFilters, UpdateAdminUserRequest } from './adminUserTypes';

export async function fetchAdminUsersAPI(filters?: AdminUserFilters): Promise<AdminUser[]> {
  try {
    const response = await axios.get('/admin/users', {
      params: filters,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    if (response.status === 304) {
      return [];
    }
    const body = response?.data;
    if (body && Array.isArray(body.data)) {
      return body.data as AdminUser[];
    }
    if (Array.isArray(body)) {
      return body as AdminUser[];
    }
    if (body && body.data && Array.isArray(body.data.rows)) {
      return body.data.rows as AdminUser[];
    }
    throw new Error('Unexpected API response shape: ' + JSON.stringify(body));
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.status + ' ' + (err.response?.statusText ?? err.message)
      : err instanceof Error
        ? err.message
        : String(err);
    throw new Error(`fetchAdminUsersAPI failed: ${message}`);
  }
}

export async function addAdminUserAPI(payload: CreateAdminUserRequest): Promise<AdminUser> {
  const res = await axios.post('/admin/users', payload);
  if (res.data && res.data.data) {
    return res.data.data as AdminUser;
  }
  return res.data as AdminUser;
}

export async function updateAdminUserAPI(payload: UpdateAdminUserRequest): Promise<AdminUser> {
  const { id, perm_reportes, perm_admin, perm_vehicle, ...rest } = payload as any

  if (!id) {
    throw new Error('updateAdminUserAPI: missing id in payload');
  }

  const body: any = { ...rest };
  if (perm_reportes !== undefined || perm_admin !== undefined || perm_vehicle !== undefined) {
    const permissions: string[] = [];
    if (perm_reportes) permissions.push('reportes');
    if (perm_admin) permissions.push('admin');
    if (perm_vehicle) permissions.push('vehicle');
    body.permissions = permissions;
  }

  Object.keys(body).forEach((k) => {
    if (body[k] === undefined) delete body[k];
  });
  const res = await axios.put('/admin/users/${encodeURIComponent(id)}', body, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (res.data && res.data.data) {
    return res.data.data as AdminUser;
  }
  return res.data as AdminUser;
}
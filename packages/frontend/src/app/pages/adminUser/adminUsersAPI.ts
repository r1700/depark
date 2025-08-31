import axios from 'axios';
import { CreateAdminUserRequest, AdminUser, AdminUserFilters, UpdateAdminUserRequest } from './adminUserTypes';

function formatAxiosError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const statusText = err.response?.statusText ?? err.message;
    const detail = err.response?.data?.message ?? err.response?.data ?? '';
    return `${status ?? ''} ${statusText} ${detail}`.trim();
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

function normalizeResponseBody<T>(res: any): T | T[] | null {
  const body = res?.data;
  if (!body) return null;
  if (Array.isArray(body)) return body as T[];
  if (body.data && Array.isArray(body.data)) return body.data as T[];
  if (body.data && body.data.rows && Array.isArray(body.data.rows)) return body.data.rows as T[];
  if (body.data && typeof body.data === 'object') return body.data as T;
  return body as T;
}

export async function fetchAdminUsersAPI(filters?: AdminUserFilters): Promise<AdminUser[]> {
  try {
    const response = await axios.get('/admin/users', {
      params: filters,
      headers: { 'Cache-Control': 'no-cache' },
    });

    if (response.status === 304) return [];

    const normalized = normalizeResponseBody<AdminUser>(response);
    if (Array.isArray(normalized)) return normalized;
    // sometimes API returns { data: { rows: [...] } } handled above; if here but single object -> wrap
    if (normalized && typeof normalized === 'object') {
      // if it's a single AdminUser object, return as single-element array
      return [normalized as AdminUser];
    }

    throw new Error('Unexpected API response shape');
  } catch (err) {
    throw new Error(`fetchAdminUsersAPI failed: ${formatAxiosError(err)}`);
  }
}

export async function addAdminUserAPI(payload: CreateAdminUserRequest): Promise<AdminUser> {
  try {
    const res = await axios.post('/admin/users', payload);
    const normalized = normalizeResponseBody<AdminUser>(res);
    if (Array.isArray(normalized)) {
      if (normalized.length === 0) throw new Error('Empty response array from addAdminUserAPI');
      return normalized[0] as AdminUser;
    }
    if (normalized && typeof normalized === 'object') return normalized as AdminUser;
    throw new Error('Unexpected API response shape from addAdminUserAPI');
  } catch (err) {
    throw new Error(`addAdminUserAPI failed: ${formatAxiosError(err)}`);
  }
}

export async function updateAdminUserAPI(payload: UpdateAdminUserRequest): Promise<AdminUser> {
  try {
    const { id, perm_reportes, perm_admin, perm_vehicle, ...rest } = payload as any;

    if (!id) throw new Error('updateAdminUserAPI: missing id in payload');

    const body: any = { ...rest };

    if (perm_reportes !== undefined || perm_admin !== undefined || perm_vehicle !== undefined) {
      const permissions: string[] = [];
      if (perm_reportes) permissions.push('reportes');
      if (perm_admin) permissions.push('admin');
      if (perm_vehicle) permissions.push('vehicle');
      body.permissions = permissions;
    }
    Object.keys(body).forEach(k => { if (body[k] === undefined) delete body[k]; });
    const res = await axios.put(`/admin/users/${encodeURIComponent(id)}`, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    const normalized = normalizeResponseBody<AdminUser>(res);
    if (Array.isArray(normalized)) {
      if (normalized.length === 0) throw new Error('Empty response array from updateAdminUserAPI');
      return normalized[0] as AdminUser;
    }
    if (normalized && typeof normalized === 'object') return normalized as AdminUser;
    throw new Error('Unexpected API response shape from updateAdminUserAPI');
  } catch (err) {
    throw new Error(`updateAdminUserAPI failed: ${formatAxiosError(err)}`);
  }
}
// adminUserTypes.ts
export const AVAILABLE_PERMISSIONS = ['reportes', 'admin', 'vehicle'] as const;
export const AVAILABLE_ROLES = ['admin', 'hr'] as const;
export type Permission = typeof AVAILABLE_PERMISSIONS[number];

export type FieldType = 'free' | 'select' | 'multiSelect' | 'dateRange' | 'date' | 'number';

export interface FieldConfig {
  name: string;
  type: FieldType;
  label?: string;
  options?: Array<string>;
  placeholder?: string;
  fromKey?: string;
  toKey?: string;
  valueAsArray?: boolean;
  defaultValue?: any;
}

export interface BaseUser {
  id?: number;
  idNumber?: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AdminUser {
  id: number;
  baseUserId: number;
  role: 'hr' | 'admin';
  permissions: string[];
  lastLoginAt?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  baseUser: BaseUser;
}

export interface AdminUserFilters {
  searchTerm?: string;
  roles?: Array<'hr' | 'admin'> | string[];
  permissionsInclude?: string[];
  lastLoginAfter?: string;
  lastLoginBefore?: string;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  activeLastNDays?: number;
  limit?: number;
  offset?: number;
}

export interface CreateAdminUserRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  passwordHash: string; // plain password from client (server will hash)
  role: 'admin' | 'hr';
  permissions: string[]; // ['reportes', 'admin']
  lastLoginAt?: string | null; // ISO string or null
}

export type AdminUserFormModel = {
  email: string;
  firstName?: string;
  lastName?: string;
  passwordHash: string;
  role: 'hr' | 'admin';
  perm_reportes: boolean;
  perm_admin: boolean;
  perm_vehicle: boolean;
  lastLoginAt?: string | null;
};

export type UpdateAdminUserRequest = {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  passwordHash?: string;
  role?: 'hr' | 'admin';
  perm_reportes?: boolean;
  perm_admin?: boolean;
  perm_vehicle?: boolean;
  lastLoginAt?: string | null;
};
// adminUserTypes.ts
export const AVAILABLE_PERMISSIONS = ['reports', 'admin', 'vehicle'] as const;
export type Permission = typeof AVAILABLE_PERMISSIONS[number];

export type FieldType = 'free' | 'select' | 'multiSelect' | 'dateRange' | 'date' | 'number';

export interface FieldConfig {
  name: string;                    // מפתח בשדה ה-filters (שמירה על שמות קיימים)
  type: FieldType;
  label?: string;
  options?: Array<string>;         // לשדות select / multiSelect
  placeholder?: string;
  fromKey?: string;                // לשדה dateRange - מפתח של "from" (e.g. 'createdAfter')
  toKey?: string;                  // לשדה dateRange - מפתח של "to" (e.g. 'createdBefore')
  valueAsArray?: boolean;          // אם הערך במצב האב הוא מערך אך ה-ui הוא select יחיד (כמו roles בעבר)
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
  // שומרים את המודל של השרת כ-string[] כדי להיות גמישים
  permissions: string[];
  lastLoginAt?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  baseUser: BaseUser;
}

export interface AdminUserFilters {
  searchTerm?: string;
  roles?: Array<'hr' | 'admin'> | string[];
  // אפשר להגדיר כאן Permission[] אם רוצים type-safe, או להשאיר string[] כדי להתאים לשרת
  permissionsInclude?: string[]; // או: string[];
  lastLoginAfter?: string;
  lastLoginBefore?: string;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  lastActivityAfter?: string;
  lastActivityBefore?: string;
  activeLastNDays?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export const AVAILABLE_ROLES = ['admin', 'hr'] as const;
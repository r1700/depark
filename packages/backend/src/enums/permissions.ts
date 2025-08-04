export enum Permission {
  Reportes = 1,
  Admin = 2,
  Vehicle = 3,
//Add additional permissions here as needed.
}

export const PermissionLabels: { [key: number]: string } = {
  [Permission.Reportes]: 'reportes',
  [Permission.Admin]: 'admin',
  [Permission.Vehicle]: 'vehicle',
};
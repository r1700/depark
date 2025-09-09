export enum Role{
    Admin=1,
    HR=2
}

export const RoleLabels: { [key: number]: string } = {
    [Role.Admin]: 'admin',
    [Role.HR]: 'hr',
};
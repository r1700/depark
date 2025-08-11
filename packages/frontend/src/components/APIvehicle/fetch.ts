export const fetchFilteredVehicles = async (filters: {
  search?: string;
  is_active?: boolean;
  is_currently_parked?: boolean;
  created_at?: string;
  updated_at?: string;
}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.is_active !== undefined) params.append('is_active', String(filters.is_active));
  if (filters.is_currently_parked !== undefined) params.append('is_currently_parked', String(filters.is_currently_parked));
  if (filters.created_at) params.append('created_at', filters.created_at);
  if (filters.updated_at) params.append('updated_at', filters.updated_at);

  const response = await fetch(`http://localhost:3001/api/vehicles/filterVehicles?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  const columns = [
    { id: 'baseuser_name', label: 'Full Name' },
    { id: 'license_plate', label: 'License Plate' },
    { id: 'phone', label: 'Phone' },          
    { id: 'email', label: 'Email' },          
    { id: 'is_active', label: 'Is Active' },
    { id: 'is_currently_parked', label: 'Is Currently Parked' },
    { id: 'created_at', label: 'Created At' },
    { id: 'updated_at', label: 'Updated At' },
  ];

  const rows = data.vehicles.map((v: any) => ({
    baseuser_name: v.baseuser_name,
    license_plate: v.license_plate,
    phone: v.phone ?? '-',
    email: v.email ?? '-',
    is_active: v.is_active,
    is_currently_parked: v.is_currently_parked,
    created_at: v.created_at,
    updated_at: v.updated_at,
  }));

  return { columns, rows };
};
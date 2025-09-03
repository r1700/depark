import { Technician } from "../model/database-models/technician.model";

export async function createTechnician(params: { name: string; email?: string; phone: string }) {
  return Technician.create(params);
}

export async function getTechnicians() {
  return Technician.findAll();
}

export async function getTechnicianById(id: number) {
  return Technician.findByPk(id);
}

export async function updateTechnician(id: number, params: { name?: string; email?: string; phone?: string }) {
  const tech = await Technician.findByPk(id);
  if (!tech) throw new Error("Technician not found");
  await tech.update(params);
  return tech;
}

export async function deleteTechnician(id: number) {
  const tech = await Technician.findByPk(id);
  if (!tech) throw new Error("Technician not found");
  await tech.destroy();
  return true;
}
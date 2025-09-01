import { Fault } from "../model/database-models/fault.model";

export async function logFault(params: {
  parkingId: number;
  faultDescription?: string | null;
  severity?: "low" | "medium" | "high";
  assigneeId?: number | null;
}) {
  const existing = await Fault.findOne({
    where: {
      parkingId: params.parkingId,
      faultDescription: params.faultDescription ?? null,
      status: "open",
    },
  });

  if (existing) {
    if (params.faultDescription) existing.set("faultDescription", params.faultDescription);
    if (params.severity) existing.set("severity", params.severity);
    if (params.assigneeId !== undefined) existing.set("assigneeId", params.assigneeId);
    await existing.save();
    return existing;
  }

  const fault = await Fault.create({
    parkingId: params.parkingId,
    faultDescription: params.faultDescription ?? null,
    severity: params.severity ?? "medium",
    assigneeId: params.assigneeId ?? null,
    status: "open",
  } as any);

  return fault;
}

export async function updateFaultStatus(faultId: number, status: "open" | "in_progress" | "resolved") {
  const fault = await Fault.findByPk(faultId);
  if (!fault) throw new Error("Fault not found");
  fault.status = status;
  if (status === "resolved") {
    fault.resolvedAt = new Date();
  }
  await fault.save();
  return fault;
}

export async function getFaultHistory(query: {
  parkingId?: number;
  status?: "open" | "in_progress" | "resolved";
  severity?: "low" | "medium" | "high";
  assigneeId?: number;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};
  if (query.parkingId !== undefined) where.parkingId = query.parkingId;
  if (query.status) where.status = query.status;
  if (query.severity) where.severity = query.severity;
  if (query.assigneeId !== undefined) where.assigneeId = query.assigneeId;

  const faults = await Fault.findAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: query.limit ?? 100,
    offset: query.offset ?? 0,
  });

  return faults;
}

export async function resolveFaultByParkingAndType(parkingId: number, faultDescription: string) {
  const fault = await Fault.findOne({
    where: {
      parkingId,
      faultDescription,
      status: "open",
    },
    order: [["createdAt", "DESC"]],
  });
  if (!fault) return null;
  fault.status = "resolved";
  fault.resolvedAt = new Date();
  await fault.save();
  return fault;
}

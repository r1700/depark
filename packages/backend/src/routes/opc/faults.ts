import { Router } from "express";
import {
  logFault,
  updateFaultStatus,
  getFaultHistory,
  resolveFaultByParkingAndType,
} from "../../services/faultService";

const router : Router = Router();

// Endpoint for logging faults
router.post("/", async (req, res) => {
  try {
    const { parkingId, faultDescription, severity, assigneeId } = req.body;
    if (!parkingId) return res.status(400).json({ error: "parkingId required" });

    const fault = await logFault({
      parkingId: Number(parkingId),
      faultDescription: faultDescription || "",
      severity: severity || "medium",
      assigneeId: assigneeId ? Number(assigneeId) : null,
    });

    res.status(201).json(fault);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "server error" });
  }
});

// Endpoint for resolving faults
router.post("/resolve", async (req, res) => {
  try {
    const { parkingId, faultDescription } = req.body;
    if (!parkingId || !faultDescription)
      return res.status(400).json({ error: "parkingId and faultDescription required" });

    const resolved = await resolveFaultByParkingAndType(Number(parkingId), String(faultDescription));
    if (!resolved) return res.status(404).json({ error: "open fault not found" });
    res.json(resolved);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "server error" });
  }
});

// Endpoint for updating fault status
router.post("/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status required" });

    const updated = await updateFaultStatus(id, status);
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "server error" });
  }
});

// Endpoint for fetching fault history
router.get("/history", async (req, res) => {
  try {
    const parkingId = req.query.parkingId ? Number(req.query.parkingId) : undefined;
    const status = req.query.status as "open" | "in_progress" | "resolved" | undefined;
    const severity = req.query.severity as "low" | "medium" | "high" | undefined;
    const assigneeId = req.query.assigneeId ? Number(req.query.assigneeId) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 100;

    const faults = await getFaultHistory({ parkingId, status, severity, assigneeId, limit });
    res.json(faults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get history" });
  }
});

export default router;
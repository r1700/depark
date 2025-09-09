import { Router } from "express";
import {
  createTechnician,
  getTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
} from "../../services/technicianService";

const router :Router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "name and phone required" });
    const tech = await createTechnician({ name, email, phone });
    res.status(201).json(tech);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const techs = await getTechnicians();
    res.json(techs);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tech = await getTechnicianById(Number(req.params.id));
    if (!tech) return res.status(404).json({ error: "not found" });
    res.json(tech);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tech = await updateTechnician(Number(req.params.id), req.body);
    res.json(tech);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteTechnician(Number(req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "server error" });
  }
});

export default router;
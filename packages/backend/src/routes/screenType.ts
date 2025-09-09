import express, { Router } from "express";
import { ScreenType } from "../model/database-models/screentype.model";
import { Logo } from "../model/database-models/logo.model";
import ScreenTypeLogo from "../model/database-models/screentypelogo.model";
const router : Router = express.Router();

// GET /api/screentypes - get all screen types
router.get("/", async (req, res) => {
	try {
		const screenTypes = await ScreenType.findAll();
		res.json({ screenTypes });
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch screen types" });
	}
});

// GET /api/screentypes/:screenType/logos - get all logo IDs for a screen type
// GET /api/screentypes/:screenType/logos - get all logo IDs for a screen type
router.get("/:screenType/logos", async (req, res) => {
	try {
			const { screenType } = req.params;
			// חפש את ה-screenTypeId לפי השם
			const screenTypeObj = await ScreenType.findOne({ where: { name: screenType } });
			if (!screenTypeObj) {
				return res.status(404).json({ error: "ScreenType not found" });
			}
			const assignments = await ScreenTypeLogo.findAll({ where: { screenTypeId: screenTypeObj.id } });
			const logoIds = assignments.map((a: ScreenTypeLogo) => a.logoId);
			res.json({ logoIds });
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch logos for screen type" });
	}
});

// POST /api/screentypes/:screenType/logos - assign logos to a screen type (replace all)
// POST /api/screentypes/:screenType/logos - assign logos to a screen type (replace all)
router.post("/:screenType/logos", async (req, res) => {
       try {
	       console.log('--- POST /api/screentypes/:screenType/logos ---');
	       console.log('params:', req.params);
	       console.log('body:', req.body);
	       const { screenType } = req.params;
	       const { logoIds } = req.body;
	       if (!Array.isArray(logoIds)) {
		       console.error('logoIds is not an array:', logoIds);
		       return res.status(400).json({ error: "logoIds must be an array", received: logoIds });
	       }
	       // בדוק שכל הלוגואים קיימים
	       const foundLogos = await Logo.findAll({ where: { id: logoIds } });
	       const foundIds = foundLogos.map(l => l.id);
	       const missingIds = logoIds.filter(id => !foundIds.includes(Number(id)));
	       let validLogoIds = logoIds.filter(id => foundIds.includes(Number(id)));
	       if (missingIds.length > 0) {
		       console.warn('Some logoIds do not exist and will be ignored:', missingIds);
	       }
	       // חפש את ה-screenTypeId לפי השם
	       const screenTypeObj = await ScreenType.findOne({ where: { name: screenType } });
	       if (!screenTypeObj) {
		       console.error('ScreenType not found:', screenType);
		       return res.status(404).json({ error: "ScreenType not found", received: screenType });
	       }
	       // Remove old assignments
	       await ScreenTypeLogo.destroy({ where: { screenTypeId: screenTypeObj.id } });
	       // Add new assignments
	       await Promise.all(
		       validLogoIds.map((logoId: string | number) => {
			       console.log('Assigning logoId:', logoId, 'to screenTypeId:', screenTypeObj.id);
			       return ScreenTypeLogo.create({ screenTypeId: screenTypeObj.id, logoId });
		       })
	       );
	       console.log('Assignment complete for screenType:', screenType, 'logoIds:', validLogoIds);
	       res.json({ success: true, ignoredLogoIds: missingIds });
       } catch (err) {
			   console.error('SERVER ERROR:', err);
			   res.status(500).json({ error: "Failed to assign logos to screen type", details: (err as Error).message || String(err) });
       }
});

// DELETE /api/screentypes/:screenType/logos/:logoId - remove a logo from a screen type
// DELETE /api/screentypes/:screenType/logos/:logoId - remove a logo from a screen type
router.delete("/:screenType/logos/:logoId", async (req, res) => {
	try {
			const { screenType, logoId } = req.params;
			// חפש את ה-screenTypeId לפי השם
			const screenTypeObj = await ScreenType.findOne({ where: { name: screenType } });
			if (!screenTypeObj) {
				return res.status(404).json({ error: "ScreenType not found" });
			}
			await ScreenTypeLogo.destroy({ where: { screenTypeId: screenTypeObj.id, logoId } });
			res.json({ success: true });
	} catch (err) {
		res.status(500).json({ error: "Failed to remove logo from screen type" });
	}
});

export default router;

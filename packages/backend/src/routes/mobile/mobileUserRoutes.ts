
import express from "express";
import { Vehicle } from "../../model/database-models/vehicle.model";
import { ParkingSession } from "../../model/database-models/parkingstssion.model";
import { Op } from "sequelize";

const router: express.Router = express.Router();

// GET - vehicles
router.get("/vehicles/:userId", async (req, res) => {
  try {

    let userId = req.params.userId;
    const vehicles = await Vehicle.findAll({ where: { baseuser_id: userId } });
    const data = vehicles.map(vehicle => ({
      ...vehicle.toJSON(),
      dimensionOverrides: typeof vehicle.dimension_overrides === "string"
        ? JSON.parse(vehicle.dimension_overrides)
        : vehicle.dimension_overrides,
    }));
    res.json(data);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "DB Error" });
  }
});

// POST - add vehicle
router.post("/vehicles2", async (req, res) => {
  const {
    baseuser_id,
    license_plate,
    vehicle_model_id,
    color,
    added_by,
    parking_session_id,
    height,
    width,
    length,
    weight,
    dimensions_source,
  } = req.body;

  try {
    const newVehicle = await Vehicle.create({
      baseuser_id,
      license_plate,
      vehicle_model_id,
      is_active: false,
      is_currently_parked: false,
      color,
      created_at: new Date(),
      updated_at: new Date(),
      added_by,
      parking_session_id,
      dimension_overrides: { height, width, length, weight },
      dimensions_source,
    } as any);

    res.status(201).json(newVehicle);
  } catch (err) {
    console.error("Error inserting vehicle:", err);
    res.status(500).json({ error: "Error inserting vehicle" });
  }
});

// GET - report
type RecordEntry = {
  timestamp: string;
  count: number;
};

type VehicleGroup = {
  license_plate: string;
  totalTime: number;
  averageTime: number;
  averageWaitTime: number;
  records: RecordEntry[];
  sessionCount: number;
  waitSum: number;
  countMap: { [timestamp: string]: number };
};

router.get("/report/:userId", async (req, res) => {
  let userId = req.params.userId;
  try {
    const now = new Date();
    const vehiclesResult = await Vehicle.findAll({
      where: { baseuser_id: userId.toString() },
    });

    const vehicles = vehiclesResult.map((v: any) => ({
      id: v.id,
      license_plate: v.license_plate,
    }));

    if (vehicles.length === 0) {
      return res.status(404).json({ error: "No vehicles found for user" });
    }

    const vehicleMap = new Map<string, string>(
      vehicles.map(v => [v.id, v.license_plate])
    );
    const vehicleIds = vehicles.map(v => v.id);

    const sessionsResult = await ParkingSession.findAll({
      where: { vehicle_id: { [Op.in]: vehicleIds } },
    });

    const sessions = sessionsResult.map((s: any) => s.toJSON());

    if (sessions.length === 0) {
      return res.status(404).json({ error: "No parking sessions found for user's vehicles" });
    }

    let grandTotalTime = 0;
    let grandWaitTime = 0;
    let grandSessionCount = 0;

    const vehicleGroups: Record<string, VehicleGroup> = {};

    for (const s of sessions) {
      const vehicleId: string = s.vehicle_id;
      const license_plate = vehicleMap.get(vehicleId);
      if (!license_plate) continue;

      const entry = new Date(s.entry_time);
      const exit = s.exit_time ? new Date(s.exit_time) : now;
      const durationMin = (exit.getTime() - entry.getTime()) / 1000 / 60;

      const waitMin = s.retrieval_request_time
        ? (new Date(s.retrieval_request_time).getTime() - entry.getTime()) / 1000 / 60
        : 0;

      const timestamp = entry.toISOString();

      if (!vehicleGroups[license_plate]) {
        vehicleGroups[license_plate] = {
          license_plate,
          totalTime: 0,
          averageTime: 0,
          averageWaitTime: 0,
          records: [],
          sessionCount: 0,
          waitSum: 0,
          countMap: {},
        };
      }

      const group = vehicleGroups[license_plate];
      group.totalTime += durationMin;
      group.waitSum += waitMin;
      group.sessionCount += 1;
      group.countMap[timestamp] = (group.countMap[timestamp] || 0) + 1;

      grandTotalTime += durationMin;
      grandWaitTime += waitMin;
      grandSessionCount += 1;
    }

    const vehiclesReport = Object.values(vehicleGroups).map(group => {
      const records = Object.entries(group.countMap)
        .map(([timestamp, count]) => ({ timestamp, count }))
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

      return {
        license_plate: group.license_plate,
        totalTime: group.totalTime,
        averageTime: group.totalTime / group.sessionCount,
        averageWaitTime: group.waitSum / group.sessionCount,
        records,
      };
    });

    const finalReport = {
      totalTime: grandTotalTime,
      averageTime: grandTotalTime / grandSessionCount,
      averageWaitTime: grandWaitTime / grandSessionCount,
      vehicles: vehiclesReport,
    };

    return res.json(finalReport);
  } catch (error) {
    console.error("Error fetching report data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
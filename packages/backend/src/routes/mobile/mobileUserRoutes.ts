



import express from "express";
import { Vehicle } from "../../model/database-models/vehicle.model";
import { ParkingSession } from "../../model/database-models/parkingstssion.model";


const router = express.Router();
import { Vehicle } from "../../model/database-models/vehicle.model";
import { ParkingSession } from "../../model/database-models/parkingstssion.model";

// GET - vehicles
router.get("/vehicles", async (req, res) => {
  try {
    const { userId } = req.query;
    const vehicles = await Vehicle.findAll({
      where: { userId },
    });

    const data = vehicles.map((vehicle: any) => ({
      ...vehicle.toJSON(),
      dimensionOverrides: typeof vehicle.dimensionOverrides === "string"
        ? JSON.parse(vehicle.dimensionOverrides)
        : vehicle.dimensionOverrides,
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
    userId,
    licensePlate,
    vehicleModelId,
    color,
    addedBy,
      ParkingSessionId,
    height,
    width,
    length,
    weight,
    dimensionsSource,
  } = req.body;

  try {
  
const newVehicle = await Vehicle.create({
 
  userId: userId,
  licensePlate,
  vehicleModelId,
  isActive: false,
  isCurrentlyParked: false,
  color,
  createdAt: new Date(),
  updatedAt: new Date(),
  addedBy,
   ParkingSessionId, 
 
  dimensionOverrides: { height, width, length, weight },
   dimensionsSource,

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
  licensePlate: string;
  totalTime: number;
  averageTime: number;
  averageWaitTime: number;
  records: RecordEntry[];
  sessionCount: number;
  waitSum: number;
  countMap: { [timestamp: string]: number };
};

router.get("/report", async (req, res) => {
  try {
    let userId = req.query.userId;
    if (!userId || typeof userId !== "string") {
      userId = "user2";
    }

    const now = new Date(); 

    const vehiclesResult = await Vehicle.findAll({
      where: { userId },
    });

    const vehicles = vehiclesResult.map((v: any) => ({
      id: v.id,
      licensePlate: v.licensePlate,
    }));

    if (vehicles.length === 0) {
      return res.status(404).json({ error: "No vehicles found for user" });
    }

    const vehicleMap = new Map<string, string>(
      vehicles.map(v => [v.id, v.licensePlate])
    );
    const vehicleIds = vehicles.map(v => v.id);

    const sessionsResult = await ParkingSession.findAll({
      where: { vehicleId: vehicleIds },
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
      const vehicleId: string = s.vehicleId;
      const licensePlate = vehicleMap.get(vehicleId);
      if (!licensePlate) continue;

      const entry = new Date(s.entryTime);
      const exit = s.exitTime ? new Date(s.exitTime) : now;
      const durationMin = (exit.getTime() - entry.getTime()) / 1000 / 60;

      const waitMin = s.retrievalRequestTime
        ? (new Date(s.retrievalRequestTime).getTime() - entry.getTime()) / 1000 / 60
        : 0;

      const timestamp = entry.toISOString();

      if (!vehicleGroups[licensePlate]) {
        vehicleGroups[licensePlate] = {
          licensePlate,
          totalTime: 0,
          averageTime: 0,
          averageWaitTime: 0,
          records: [],
          sessionCount: 0,
          waitSum: 0,
          countMap: {},
        };
      }

      const group = vehicleGroups[licensePlate];
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
        licensePlate: group.licensePlate,
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


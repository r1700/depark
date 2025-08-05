import express from "express";
import { Pool } from "pg";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "0533160520",
  database: "depark",
});

app.get("/api/report", async (req, res) => {
  try {
    const userId = typeof req.query.userId === "string" ? req.query.userId : "user2";

    // שליפת רכבים של המשתמש
    const vehiclesResult = await pool.query(
      `SELECT id FROM "Vehicles" WHERE "userId" = $1`,
      [userId]
    );
    const vehicles = vehiclesResult.rows;
    if (!vehicles.length) {
      return res.status(404).json({ error: "No vehicles found for user" });
    }
    const vehicleIds = vehicles.map((v) => v.id);

    // שליפת סשנים עבור הרכבים
    const sessionsResult = await pool.query(
      `SELECT "entryTime", "exitTime", "retrievalRequestTime" FROM "ParkingSessions" WHERE "vehicleId" = ANY($1::text[])`,
      [vehicleIds]
    );
    const sessions = sessionsResult.rows;
    if (!sessions.length) {
      return res.status(404).json({ error: "No parking sessions found for user's vehicles" });
    }

    // חישוב זמן חניה כולל (בדקות)
    const totalTime = sessions.reduce((acc, s) => {
      const entry = new Date(s.entryTime);
      const exit = s.exitTime ? new Date(s.exitTime) : new Date();
      return acc + (exit.getTime() - entry.getTime()) / 1000 / 60;
    }, 0);

    // ממוצע זמן חניה
    const averageTime = totalTime / sessions.length;

    // חישוב זמן המתנה ממוצע (רק לסשנים עם retrievalRequestTime)
    const sessionsWithWait = sessions.filter((s) => s.retrievalRequestTime);
    const totalWaitTime = sessionsWithWait.reduce((acc, s) => {
      const entry = new Date(s.entryTime);
      const retrieval = new Date(s.retrievalRequestTime);
      return acc + (retrieval.getTime() - entry.getTime()) / 1000 / 60;
    }, 0);
    const averageWaitTime = sessionsWithWait.length ? totalWaitTime / sessionsWithWait.length : 0;

    // חישוב שעות שיא
    const peakHoursMap = new Map<number, number>();
    sessions.forEach((s) => {
      const hour = new Date(s.entryTime).getHours();
      peakHoursMap.set(hour, (peakHoursMap.get(hour) || 0) + 1);
    });
    const peakHours = Array.from(peakHoursMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }));

    // החזרת דוח מסודר
    res.json({
      totalTime,
      averageTime,
      averageWaitTime,
      // peakHours,
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, () => {
  console.log("Server listening on http://localhost:3001");
});
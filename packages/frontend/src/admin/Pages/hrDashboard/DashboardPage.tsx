import React, { useEffect, useState, useRef } from "react";
import DashboardBox from "../../components/hrDashboardBox/dashboardBox";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import FavoriteIcon from "@mui/icons-material/Favorite";

function formatMinutesToHoursAndMinutes(totalMinutes: number | null | string): string | null {
  if (totalMinutes === null) return null;
  const minutesNumber = typeof totalMinutes === "string" ? parseFloat(totalMinutes) : totalMinutes;
  if (isNaN(minutesNumber)) return null;
  const hours = Math.floor(minutesNumber / 60);
  const minutes = Math.floor(minutesNumber % 60);
  return `${hours}h ${minutes}m`;
}

type UserStatistics = {
  activeUsers: number | null;
  totalAllowedCars: number | null;
  activeUsersChangePercent: number | null;
  totalAllowedCarsChangePercent: number | null;
  waitingRetrievals: number | null;
  waitingRetrievalsChangePercecent: number | null;
  avgWaitTime: number | null | string;
  avgWaitTimeChangePercent: number | null;
  cancelledOrNotRetrieved: number | null;
  cancelledOrNotRetrievedChangePercent: number | null;
};

type HealthStat = {
  component: string;
  status: string;
};

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<UserStatistics>({
    activeUsers: null,
    totalAllowedCars: null,
    activeUsersChangePercent: null,
    totalAllowedCarsChangePercent: null,
    waitingRetrievals: null,
    waitingRetrievalsChangePercecent: null,
    avgWaitTime: null,
    avgWaitTimeChangePercent: null,
    cancelledOrNotRetrieved: null,
    cancelledOrNotRetrievedChangePercent: null,
  });

  const [systemHealth, setSystemHealth] = useState<HealthStat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const Icons: { [key: string]: React.ReactNode } = {
    "Approved Users": <VerifiedUserIcon sx={{ fontSize: 30, color: "green" }} />,
    "Total Allowed Cars": <DirectionsCarIcon sx={{ fontSize: 30, color: "blue" }} />,
    "Waiting Retrievals": <HourglassEmptyIcon sx={{ fontSize: 30, color: "orange" }} />,
    "Average Wait Time": <AccessTimeIcon sx={{ fontSize: 30, color: "black" }} />,
    "Cancelled or Not Retrieved Cars": <CancelIcon sx={{ fontSize: 30, color: "red" }} />,
  };

  const connectWebSocket = () => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      setError(null);
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg?.type === "update" && msg?.data) {
          const { data } = msg;

          if (data.userAndCarStats) {
            setStatistics((prev) => ({
              ...prev,
              activeUsers: data.userAndCarStats.activeUsers ?? prev.activeUsers,
              activeUsersChangePercent: data.userAndCarStats.activeUsersChangePercent ?? prev.activeUsersChangePercent,
              totalAllowedCars: data.userAndCarStats.totalAllowedCars ?? prev.totalAllowedCars,
              totalAllowedCarsChangePercent:
                data.userAndCarStats.totalAllowedCarsChangePercent ?? prev.totalAllowedCarsChangePercent,
            }));
          }

          if (data.activeRetrievalRequests) {
            setStatistics((prev) => ({
              ...prev,
              waitingRetrievals: data.activeRetrievalRequests.waitingRetrievals ?? prev.waitingRetrievals,
              waitingRetrievalsChangePercecent:
                data.activeRetrievalRequests.waitingRetrievalsChangePercecent ?? prev.waitingRetrievalsChangePercecent,
              avgWaitTime: data.activeRetrievalRequests.avgWaitTime ?? prev.avgWaitTime,
              avgWaitTimeChangePercent:
                data.activeRetrievalRequests.avgWaitTimeChangePercent ?? prev.avgWaitTimeChangePercent,
              cancelledOrNotRetrieved:
                data.activeRetrievalRequests.cancelledOrNotRetrieved ?? prev.cancelledOrNotRetrieved,
              cancelledOrNotRetrievedChangePercent:
                data.activeRetrievalRequests.cancelledOrNotRetrievedChangePercent ??
                prev.cancelledOrNotRetrievedChangePercent,
            }));
          }

          if (data.systemHealthStats) {
            setSystemHealth(data.systemHealthStats);
          }
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onerror = () => {
      setError("WebSocket connection error");
      console.error("❌ WebSocket error");
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket closed, reconnecting...");
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, []);

  if (error) {
    return (
      <div style={{ color: "red", padding: 20, fontWeight: "bold" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 20 }}>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <DashboardBox
          title="Approved Users"
          data={statistics.activeUsers}
          icon={Icons["Approved Users"]}
          changePercent={statistics.activeUsersChangePercent}
          percentageDisplay={true}
          comparisonTime="month"
        />
        <DashboardBox
          title="Total Allowed Cars"
          data={statistics.totalAllowedCars}
          icon={Icons["Total Allowed Cars"]}
          changePercent={statistics.totalAllowedCarsChangePercent}
          percentageDisplay={true}
          comparisonTime="month"
        />
        <DashboardBox
          title="Waiting Retrievals"
          data={statistics.waitingRetrievals}
          icon={Icons["Waiting Retrievals"]}
          changePercent={statistics.waitingRetrievalsChangePercecent}
          percentageDisplay={false}
        />
        <DashboardBox
          title="Average Wait Time"
          data={formatMinutesToHoursAndMinutes(statistics.avgWaitTime)}
          icon={Icons["Average Wait Time"]}
          changePercent={statistics.avgWaitTimeChangePercent}
          percentageDisplay={true}
          comparisonTime="day"
        />
        <DashboardBox
          title="Unretrieved Cars"
          data={statistics.cancelledOrNotRetrieved}
          icon={Icons["Cancelled or Not Retrieved Cars"]}
          changePercent={statistics.cancelledOrNotRetrievedChangePercent}
          percentageDisplay={false}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 24 }}>
        <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 24, minWidth: 320, boxShadow: "0px 3px 6px rgba(0,0,0,0.16)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <FavoriteIcon sx={{ fontSize: 30, color: "#f72e2eff" }} />
            <span style={{ fontWeight: "bold", fontSize: 18 }}>System Health</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {systemHealth.map((item) => (
              <div key={item.component} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: "bold" }}>{item.component}:</span>
                <span>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default Dashboard;

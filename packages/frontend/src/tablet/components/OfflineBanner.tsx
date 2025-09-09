import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const OfflineBanner: React.FC = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {

    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));

    return () => {
      window.removeEventListener("online", () => setOnline(true));
      window.removeEventListener("offline", () => setOnline(false));
    };
  }, []);
  if (online) return null;
  return (
    <Box
      sx={{
        bgcolor: "error.main",
        color: "white",
        p: 2,
        borderRadius: 2,
        mb: 2,
        textAlign: "center",
        maxWidth: 400,
        margin: "0 auto"
      }}
    >
      <Typography variant="body1">
        ⚠ No internet connection – operating in offline mode
      </Typography>
    </Box>
  );
};

export default OfflineBanner;

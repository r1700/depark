
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Notification {
  id: number;
  baseuser_id: number;
  type: string;
  message: string;
  read: boolean;
  timestamp: string;
}
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const baseuserId = params.get("baseuser_id");

    if (baseuserId) {
      setUserId(Number(baseuserId));
    } else {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user?.userId) {
            setUserId(user.userId);
          }
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    }
  }, [location.search]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `${API_BASE}/notifications?baseuser_id=${userId}`
        );
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId: number) => {
    try {
      await axios.post(`${API_BASE}/notifications/mark-read`, {
        notificationIds: [notificationId],
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };



  return (
    <Box
      p={2}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        background: "linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)",
        borderRadius: 0,
        boxShadow: "0 8px 32px rgba(30,144,255,0.10)",
        maxWidth: 420,
        width: "100vw",
        mx: "auto",
      }}
    >
      <Box width="100%" mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/VehicleRow')}
          sx={{
            color: "#1976d2",
            borderColor: "#1976d2",
            fontWeight: 'bold',
            borderRadius: 2,
            px: 2,
            py: 1,
            mb: 2,
            background: "#e3f2fd",
            "&:hover": {
              background: "#bbdefb",
              borderColor: "#1976d2",
            },
          }}
        >
          Back
        </Button>

      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: "100%",
          alignItems: "center"
        }}>
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              sx={{
                p: 2,
                width: "95vw",
                maxWidth: 340,
                minHeight: 90,
                textAlign: "left",
                boxShadow: "0 4px 16px rgba(30,144,255,0.10)",
                borderRadius: 4,
                background: "linear-gradient(135deg, #e3f2fd 0%, #f8fbff 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                border: `1px solid #1976d2`,
                transition: "0.2s",
                mx: "auto",
                "&:hover": {
                  background: "linear-gradient(135deg, #d0e6fc 0%, #e3f2fd 100%)",
                  boxShadow: "0 8px 32px rgba(30,144,255,0.18)",
                },
                "&:active": {
                  background: "linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%)",
                  boxShadow: "0 4px 16px rgba(30,144,255,0.22)",
                },
              }}
            >
              <Typography fontWeight="bold" sx={{ color: "#1976d2", fontSize: "1.1rem" }}>
                {notification.type}
              </Typography>
              <Typography fontSize="1rem" sx={{ color: "#1976d2", mt: 1 }}>
                {notification.message}
              </Typography>
              <Typography variant="caption" sx={{ color: "#888", mt: 0.5 }}>
                {new Date(notification.timestamp).toLocaleString()}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                {!notification.read && (
                  <IconButton
                    onClick={() => markAsRead(notification.id)}
                    sx={{
                      borderRadius: 2,
                      color: "#1976d2",
                      background: "#e3f2fd",
                      boxShadow: "0 2px 8px rgba(30,144,255,0.08)",
                      mt: 1,
                      "&:hover": {
                        background: "#bbdefb",
                      },
                    }}
                  >
                    <MailOutlineIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                )}
                {notification.read && (
                  <MarkEmailReadIcon sx={{ color: "#1976d2", fontSize: 28, mt: 1 }} />
                )}
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};


export default Notifications;

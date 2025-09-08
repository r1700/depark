import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Card, CardContent, CircularProgress, Box } from '@mui/material';
import VehicleInQueue from '../VehicleInQueue/VehicleInQueue';
import { sendElevatorQueue } from '../../services/api';
import './VehicleQueue.css';

export interface Vehicle {
  licensePlate: string;
  model?: string;
}

const VehicleQueue: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queues = location.state?.queues || [];
  const userVehicle = location.state?.userVehicle || '';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<Vehicle[]>([]);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const normalizedQueues = Array.isArray(queues) ? queues : [queues];
  const floorNumber = location.state?.floorNumber || 1;

  // Debug: Print the queues data to console
  console.log('VehicleQueue - queues:', queues);
  console.log('VehicleQueue - normalizedQueues:', normalizedQueues);

  return (
    <div className="vehicle-queue-main-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 32 }}>
      <div className="vehicle-queue-container" style={{ width: '100%', maxWidth: 1200, marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <h1 style={{ marginTop: 0, marginBottom: 18, fontWeight: 800, fontSize: '2.3em', color: '#1976d2', textAlign: 'center', letterSpacing: 1 }}>Vehicle Queues</h1>
        <div className="floor-title" style={{
          fontSize: '1.5em',
          fontWeight: 700,
          color: '#1976d2',
          marginBottom: 20,
          textAlign: 'center',
          letterSpacing: 1.2,
          textShadow: '0 2px 8px #e3f0ff',
          background: 'linear-gradient(90deg, #e3f0ff 0%, #f8faff 100%)',
          borderRadius: '14px',
          padding: '7px 0',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)'
        }}>floor {floorNumber}</div>
        <div className="vehicle-queue-list" style={{ marginTop: 0 }}>
          {normalizedQueues.length === 0 ? (
            <Typography sx={{ mt: 4, fontSize: 22, color: '#1976d2', fontWeight: 700 }}>No queues found for this floor.</Typography>
          ) : (
            normalizedQueues.map((queue: any, idx: number) => (
              <Card key={queue.elevatorNumber} className="elevator-block" sx={{ margin: '0 8px 16px 8px', borderRadius: 3, boxShadow: 2, minWidth: 200, maxWidth: 260 }}>
                <CardContent>
                  <div className="elevator-title" style={{ marginBottom: 10 }}>Elevator #{queue.elevatorNumber}</div>
                  {queue.firstVehicle ? (
                    <div className="vehicles-row-simple" style={{ justifyContent: 'center', width: '100%' }}>
                      <div className="vehicle-card-center" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <VehicleInQueue
                          vehicle={queue.firstVehicle}
                          position={0}
                          queueNumber={queue.elevatorNumber}
                          userVehicle={userVehicle}
                          estimatedWaitTime={queue.firstVehicle.estimatedWait || 0}
                        />
                      </div>
                      <button className="expand-btn" onClick={async e => {
                        e.stopPropagation();
                        setLoadingDialog(true);
                        setDialogOpen(true);
                        const floorNumber = location.state?.floorNumber || 1;
                        const elevatorNumber = queue.elevatorNumber;
                        const response = await sendElevatorQueue(floorNumber, elevatorNumber);
                        setSelectedQueue(response.vehicles);
                        setLoadingDialog(false);
                      }}>
                        Remaining vehicles in queue ({(queue.remainingCount || 0) + 1})
                      </button>
                    </div>
                  ) : (
                    <span className="empty-queue">Empty queue</span>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <Button variant="contained" className="back-button" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Vehicles in Queue</DialogTitle>
        <DialogContent>
          {loadingDialog ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 80 }}>
              <CircularProgress />
            </Box>
          ) : selectedQueue.length === 0 ? (
            <Typography>No vehicles in this queue</Typography>
          ) : (
            selectedQueue.map((v: any, idx: number) => (
              <Typography key={v.licensePlate} sx={{ mb: 1 }}>
                {idx + 1}. <span style={{ fontWeight: 700 }}>{v.licensePlate}</span> — Estimated wait: {v.estimatedWait} min
              </Typography>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default VehicleQueue;
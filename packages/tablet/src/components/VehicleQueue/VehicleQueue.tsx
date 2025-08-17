import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import VehicleInQueue from '../VehicleInQueue/VehicleInQueue';
import { ESTIMATED_TIME_PER_VEHICLE } from '../../data';
import './VehicleQueue.css';

export interface Vehicle {
  licensePlate: string;
  model?: string;
}

const VehicleQueue: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queues: Vehicle[][] = location.state.queues || [];
  const userVehicle = location.state?.userVehicle || '';
  const toggleQueue = (index: number) => {
    setExpandedQueue(expandedQueue === index ? null : index);
  };

  const [expandedQueue, setExpandedQueue] = useState<number | null>(null);

  return (
    <div className="vehicle-queue-container">
      <h1>Vehicle Queues</h1>
      <div className="vehicle-queue-list">
        {queues.map((queue, index) => {
          const countMore = queue.length - 1;
          return (
            <div key={index} style={{ position: 'relative' }}>
              <div className="single-queue"
                onClick={() => toggleQueue(index)}>
                <h4>queue #{index + 1}</h4>
                {queue.length > 0 ? (
                  <>
                    <VehicleInQueue
                      vehicle={queue[0]}
                      position={0}
                      queueNumber={index + 1}
                      userVehicle={userVehicle}
                      estimatedWaitTime={0}
                    />
                    {countMore > 0 && (
                      <div className="count-more">+{countMore}</div>
                    )}
                  </>
                ) : (
                  <div>Empty queue</div>
                )}
              </div>

              {expandedQueue === index && queue.length > 0 && (
                <div className="expanded-queue">
                  <ul>
                    {queue.map((v, idx) => (
                      <li key={idx}>
                        {idx + 1}. {v.licensePlate} — Estimated wait time: {idx * ESTIMATED_TIME_PER_VEHICLE} min
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button variant="contained" className="back-button" onClick={() => navigate(-1)}>
        Back
      </Button>
    </div>
  );
};

export default VehicleQueue;
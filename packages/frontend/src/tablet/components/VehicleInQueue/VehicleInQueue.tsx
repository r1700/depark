import React from 'react';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import './VehicleInQueue.css';

interface VehicleInQueueProps {
    vehicle: {
        licensePlate: string;
        model?: string;
    };
    position: number;
    userVehicle: string;
}

const VehicleInQueue: React.FC<VehicleInQueueProps> = ({ vehicle, position, userVehicle }) => {
    const isUserVehicle = vehicle.licensePlate === userVehicle;
    return (
        <div className="vehicle">
            <DirectionsCarIcon style={{ fontSize: 50, color: '#007BFF' }} />
            <span className="license-plate">
                {vehicle.licensePlate}
            </span>
            {vehicle.model && (
                <span className="model">{vehicle.model}</span>
            )}
            {isUserVehicle && (
                <span className="queue-position">
                    (מקום בתור: {position + 1})
                </span>
            )}
        </div>
    );
};

export default VehicleInQueue;

import React from 'react';
import VehicleInQueue from '../VehicleInQueue/VehicleInQueue';
import './VehicleQueue.css';

interface Vehicle {
    licensePlate: string;
    model?: string;
}

interface VehicleQueueProps {
    vehicles: Vehicle[];
    userVehicle: string;
}

const VehicleQueue: React.FC<VehicleQueueProps> = ({ vehicles, userVehicle }) => {
    const visibleVehicles = vehicles.slice(0, 5);

    return (
        <div className="vehicle-queue">
            {visibleVehicles.map((vehicle, index) => (
                <VehicleInQueue 
                    key={vehicle.licensePlate} 
                    vehicle={vehicle} 
                    position={index} 
                    userVehicle={userVehicle || ''} 
                />
            ))}

            {vehicles.length > 5 && (
                <div className="vehicle more">
                    <span className="license-plate">
                        +{vehicles.length - 5} More
                    </span>
                </div>
            )}
        </div>
    );
};

export default VehicleQueue;

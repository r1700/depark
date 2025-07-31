import React from 'react';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
interface Vehicle {
    licensePlate: string;
}
interface VehicleQueueProps {
    vehicles: Vehicle[];
    userVehicle?: string;
}
const VehicleQueue: React.FC<VehicleQueueProps> = ({ vehicles, userVehicle }) => {
    const visibleVehicles = vehicles.slice(0, 5);
    return (
        <div className="vehicle-queue">
            {visibleVehicles.map((vehicle, index) => (
                <div
                    key={index}
                    className={`vehicle${userVehicle === vehicle.licensePlate ? ' selected' : ''}`}
                    aria-label={userVehicle === vehicle.licensePlate ? 'הרכב שלך בתור' : undefined}
                >
                    <DirectionsCarIcon style={{ fontSize: 40, color: '#007BFF' }} />
                    <span className="license-plate">
                        {vehicle.licensePlate}
                    </span>
                </div>
            ))}
            {vehicles.length > 5 && (
                <div className="vehicle">
                    <span className="license-plate" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        +{vehicles.length - 5} More
                    </span>
                </div>
            )}
        </div>
    );
};
export default VehicleQueue;

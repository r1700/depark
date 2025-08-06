
// בס"ד

import isParkingLotActive from "./lotParking";
// import  isLicensePlateExists from "./licensePlate";
import canUserPark from "./authorization";
// import  vehicleModel from "./licensePlate";
import { isLicensePlateExists, vehicleModel } from "./licensePlate";

interface VehicleLookupRequest {
    licensePlate: string;
    timestamp: Date;
    opcRequestId: string;
    lotId: number;
}

interface VehicleLookupResponse {
    found: boolean;
    vehicleDetails?: {
        height: number | undefined;
        width: number | undefined;
        length: number | undefined;
    };
    userId?: number;
    approved: boolean;
    error?: string;
}

const isVehicleAllowed = async (vehicleReq: VehicleLookupRequest): Promise<VehicleLookupResponse> => {
    try {
        const { licensePlate, timestamp, opcRequestId, lotId } = vehicleReq;

        // Check if the parking lot is active at the given timestamp
        const isActive = await isParkingLotActive(timestamp, lotId);
        if (!isActive) {
            return {
                found: false,
                approved: false,
                error: 'Parking lot is not active at the requested time'
            };
        }

        // Check if the vehicle is allowed to park
        const vehicleDetails = await isLicensePlateExists(licensePlate);
        if (!vehicleDetails.found) {
            return {
                found: false,
                approved: false,
                error: 'Vehicle not found'
            };
        }

        // Check if the user can park
        const canPark = await canUserPark(vehicleDetails.userId!);
        if (!canPark) {
            return {
                found: true,
                approved: false,
                error: 'User cannot park more vehicles'
            };
        }

        // If the vehicle is found and the user can park, return the vehicle model
        if (!vehicleDetails.vehicle_model_id) {
            return {
                found: true,
                approved: true,
                error: 'Vehicle model ID not found'
            };
        }
        const modelDetails = await vehicleModel(vehicleDetails.vehicle_model_id);


        // If all checks pass, return the vehicle details
        return {
            found: true,
            vehicleDetails: {
                height: modelDetails.vehicleDetails!.height,
                width: modelDetails.vehicleDetails!.width,
                length: modelDetails.vehicleDetails!.length,
            },
            userId: vehicleDetails.userId,
            approved: true
        };


    } catch (err) {
        console.error('Error checking vehicle allowance', err);
        return {
            found: false,
            approved: false,
            error: 'Error checking vehicle allowance'
        };
    }
}


// isVehicleAllowed({
//     licensePlate: 'ABC123',
//     timestamp: new Date(),
//     opcRequestId: '12345',
//     lotId: 2
// }).then(response => {
//     console.log('Vehicle Lookup Response:', response);
// }).catch(err => {
//     console.error('Error in vehicle lookup:', err);
// });

export default isVehicleAllowed;
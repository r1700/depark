
// בס"ד

import isParkingLotActive from "./lotParking";
import canUserPark from "./authorization";
import { isLicensePlateExists, vehicleModel } from "./licensePlate";

// interface VehicleLookupRequest {
//     licensePlate: string;
//     timestamp: Date;
//     opcRequestId: string;
//     lotId: number;
// }

// interface VehicleLookupResponse {
//     found: boolean;
//     vehicleDetails?: {
//         height: number | undefined;
//         width: number | undefined;
//         length: number | undefined;
//     };
//     userId?: number;
//     approved: boolean;
//     error?: string;
// }

type VehicleLookupRequest = [string, Date, string, number];

type VehicleLookupResponse = [boolean, (number | undefined)[], number | undefined, boolean, boolean | undefined, string | undefined];


const isVehicleAllowed = async (vehicleReq: VehicleLookupRequest): Promise<VehicleLookupResponse> => {
    try {
        const [licensePlate, timestamp, opcRequestId, lotId] = vehicleReq;

        // Check if the vehicle is allowed to park
        const vehicleDetails = await isLicensePlateExists(licensePlate);
        if (!vehicleDetails.found) {
            return [false, [], undefined, false, undefined, 'Vehicle not found'];
        }

        // Check if the parking lot is active at the given timestamp
        const isActive = await isParkingLotActive(timestamp, lotId);
        if (!isActive.active) {
            return [true, [], vehicleDetails.userId, false, undefined, isActive.message]
        }

        // Check if the user can park
        const canPark = await canUserPark(vehicleDetails.userId!);
        if (!canPark) {
            return [true, [], vehicleDetails.userId, false, undefined, 'User cannot park more vehicles']
        }

        // If the vehicle is found and the user can park, return the vehicle model
        if (!vehicleDetails.vehicle_model_id) {
            return [true, [], vehicleDetails.userId, true, true, 'this vehicle goes to reseved place']
        }
        const modelDetails = await vehicleModel(vehicleDetails.vehicle_model_id);


        // If all checks pass, return the vehicle details
        return [true,
            [modelDetails.vehicleDetails?.height, modelDetails.vehicleDetails?.width, modelDetails.vehicleDetails?.length],
            vehicleDetails.userId,
            true,
            undefined,
            undefined];

    } catch (err) {
        console.error('Error checking vehicle allowance', err);
        return [false,[], undefined, false,
            false,
            'Error checking vehicle allowance']

    };
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
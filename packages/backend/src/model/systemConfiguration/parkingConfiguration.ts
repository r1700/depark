import Joi from 'joi';

export const ParkingConfigurationSchema = Joi.object({
  id: Joi.string().required(),
  facilityName: Joi.string().required(),
  totalSurfaceSpots: Joi.number().integer().min(1).required(), // לפחות 1 מקום
  surfaceSpotIds: Joi.array().items(Joi.string()).min(1).max(6).required(), // מזהים של מקומות
  avgRetrievalTimeMinutes: Joi.number().integer().min(0).default(1).required(), // מינימום 0 דקות
  maxQueueSize: Joi.number().integer().min(1).required(), // לפחות 1
  operatingHours: Joi.object({
    start: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // פורמט זמן "HH:mm"
    end: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required() // פורמט זמן "HH:mm"
  }).required(),
  timezone: Joi.string().required(),
  updatedAt: Joi.date().required(),
  updatedBy: Joi.string().required(),
});

// דוגמה לשימוש בסכמה

const parkingConfigData = {
  id: "parking1",
  facilityName: "Main Parking Lot",
  totalSurfaceSpots: 6,
  surfaceSpotIds: ["spot1", "spot2", "spot3"],
  avgRetrievalTimeMinutes: 1,
  maxQueueSize: 10,
  operatingHours: {
    start: "07:00",
    end: "19:00"
  },
  timezone: "UTC",
  updatedAt: new Date(),
  updatedBy: "admin"
};

const { error, value } = ParkingConfigurationSchema.validate(parkingConfigData);
if (error) {
  console.error("Validation error:", error.details);
} else {
  console.log("Validated Parking Configuration:", value);
}

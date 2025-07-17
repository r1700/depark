import Joi from 'joi';

// יצירת מחלקת UsageReport
export class UsageReport {
  static schema = Joi.object({
    id: Joi.string().required(),
    reportType: Joi.valid('daily', 'weekly', 'monthly', 'custom').required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    generatedBy: Joi.string().required(), // user ID
    data: Joi.object({
      totalSessions: Joi.number().required(),
      avgParkingDuration: Joi.number().required(),
      avgRetrievalTime: Joi.number().required(),
      peakHours: Joi.array().items(
        Joi.object({
          hour: Joi.number().required(),
          sessions: Joi.number().required(),
        })
      ).required(),
      utilizationRate: Joi.number().required(),
      userStats: Joi.array().items(
        Joi.object({
          userId: Joi.string().required(),
          sessionCount: Joi.number().required(),
        })
      ).required(),
    }).required(),
    format: Joi.valid('json', 'csv', 'pdf').required(),
    filePath: Joi.string().optional(),
    generatedAt: Joi.date().required(),
  });

  constructor(
    public id: string,
    public reportType: 'daily' | 'weekly' | 'monthly' | 'custom',
    public startDate: Date,
    public endDate: Date,
    public generatedBy: string,
    public data: {
      totalSessions: number;
      avgParkingDuration: number;
      avgRetrievalTime: number;
      peakHours: { hour: number; sessions: number }[];
      utilizationRate: number;
      userStats: { userId: string; sessionCount: number }[];
    },
    public format: 'json' | 'csv' | 'pdf',
    public filePath?: string,
    public generatedAt: Date = new Date()
  ) {}

  // פונקציה ליצירת UsageReport
  static create(data: any): UsageReport {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new UsageReport(
      value.id,
      value.reportType,
      value.startDate,
      value.endDate,
      value.generatedBy,
      value.data,
      value.format,
      value.filePath,
      value.generatedAt
    );
  }
}

// דוגמת יצירה של UsageReport
const newUsageReport = UsageReport.create({
  id: 'report123',
  reportType: 'daily',
  startDate: new Date('2025-07-01'),
  endDate: new Date('2025-07-01'),
  generatedBy: 'user123',
  data: {
    totalSessions: 100,
    avgParkingDuration: 45,
    avgRetrievalTime: 5,
    peakHours: [
      { hour: 14, sessions: 20 },
      { hour: 18, sessions: 15 },
    ],
    utilizationRate: 0.85,
    userStats: [
      { userId: 'user123', sessionCount: 20 },
      { userId: 'user456', sessionCount: 15 },
    ],
  },
  format: 'json',
  generatedAt: new Date(),
});

console.log(newUsageReport);  // הצגת אובייקט UsageReport שנוצר
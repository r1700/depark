import Joi from 'joi';

// Creating a UsageReport class
export class UsageReport {
  static schema = Joi.object({
    id:  Joi.number().integer().positive().optional(),
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
    public generatedAt: Date = new Date(),
    public id?: number // identty
  ) {}

  // Function to create a UsageReport
  static create(data: any): UsageReport {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new UsageReport(
      value.reportType,
      value.startDate,
      value.endDate,
      value.generatedBy,
      value.data,
      value.format,
      value.filePath,
      value.generatedAt,
      value.id
    );
  }
}


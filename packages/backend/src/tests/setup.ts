// src/tests/setup.ts

// משתנה סודי לטוקן
process.env.JWT_SECRET = 'test-secret';

// מוקים ל־operation.ts כדי למנוע חיבור אמיתי למסד נתונים
jest.mock('../services/db/operation', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  },
  getId: jest.fn(),
  getRole: jest.fn(),
}));

// לפני כל טסט ננקה את כל המוקים
beforeEach(() => {
  jest.clearAllMocks();
});

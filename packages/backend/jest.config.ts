module.exports = {
  testEnvironment: 'node',  // לדוגמה, אם אתה מריץ בדיקות עבור Node.js
  transform: {
    '^.+\\.ts$': 'ts-jest', // אם אתה משתמש ב-TypeScript
  },
};

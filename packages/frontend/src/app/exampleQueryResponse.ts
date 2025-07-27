
// exampleQueryResponse.ts
export const getBaseDayQuery = () => ([
  { id: 1, date: '2024-01-01', count: 10 },
  { id: 2, date: '2024-01-02', count: 15 }
]);

export const getBaseMonthQuery = () => ([
  { id: 1, month: '2024-01', count: 100 },
  { id: 2, month: '2024-02', count: 120 },
  { id: 3, month: '2024-03', count: 165 }
]);

export const getBaseHourQuery = () => ([
  { id: 1, hour: '10:00', count: 5 },
  { id: 2, hour: '11:00', count: 7 }
]);

export const getUserQuery = () => ([
  { id: 1, user: 'John', activity: 'Enter' },
  { id: 2, user: 'Jane', activity: 'Exit' }
]);

export const getFullHourQuery = () => ([
  { id: 1, hour: '10:00', total: 50 },
  { id: 2, hour: '11:00', total: 60 }
]);

export const getFullDayQuery = () => ([
  { id: 1, date: '2024-01-01', total: 500 },
  { id: 2, date: '2024-01-02', total: 550 }
]);


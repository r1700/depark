export const getBaseMonthQuery = () => ({
  columns: [
    { id: "id", label: "ID" },
    { id: "date", label: "Date" },
    { id: "count", label: "Count" }
  ],
  rows: [
    { id: 1, date: "2024-01", count: 100 },
    { id: 2, date: "2024-02", count: 120 },
    { id: 3, date: "2024-03", count: 165 },
    { id: 4, date: "2024-01", count: 100 },
    { id: 5, date: "2024-02", count: 120 },
    { id: 6, date: "2024-03", count: 165 }
  ]
});
export const getBaseDayQuery = () => ({
  columns: [
    { id: "id", label: "ID" },
    { id: "date", label: "Date" },
    { id: "count", label: "Count" }
  ],
  rows: [
    { id: 1 ,date: "2024-01-01", count: 10 },
    { id: 2 , date: "2024-01-02" , count: 15 },
    { id: 3 , date: "2024-01-02" , count: 14 }
  ]
});
export const getBaseHourQuery = () => ({
  columns: [
    { id: "id", label: "ID" },
    { id: "date", label: "Date" },
    { id: "count", label: "Count" },
    { id: "isExist", label: "Hour" },
  ],
  rows: [
    { id: 1,  date: "10:00" ,  count: 5 ,  isExist: true },
    { id: 2 ,date: "11:00" ,  count: 7 ,  isExist: false }
  ]
});
export const getUserQuery = () => ({
  columns: [
    {id:'id', label: 'ID'},
    { id:'user', label: 'User' },
    { id:'activity', label: 'Activity' }
  ],
  rows: [
    { id: 1 , user: "John" ,  activity: "Enter" },
    { id: 2 ,  user: "Jane" ,  activity: "Exit" }
  ]
});
export const getFullHourQuery = () => ({
  columns: [
    { id: "id",label: "ID" },
    { id:"hour",label: "Hour" },
    { id:"total",label: "Total" }
  ],
  rows: [
    { id: 1 , hour: "10:00" ,  total: 50 },
    { id: 2 ,  hour: "11:00" , total: 60 }
  ]
});
export const getFullDayQuery = () => ({
  columns: [
    { id: "id",label: "ID" },
    { id:"hour",label: "Hour" },
    { id:"total",label: "Total" }
  ],
  rows: [
    { id: 1 ,hour: "2024-01-01" ,  total: 500 },
    { id: 2 ,  hour: "2024-01-02" ,  total: 550 }
  ]
});
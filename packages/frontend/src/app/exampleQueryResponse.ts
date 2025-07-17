
function getBaseMonthQuery(): object {
    return {
        baseMonthQuery: {
            title: 'baseMonth',
            month: "2023-10",
            numOfVehicle: 24073,
            numOfHoursOccupied: 12002
        }
    };
}
function getBaseDayQuery(): object {
    return {
        BaseDayQuery: {
            title: 'baseDay',
            day: "2023-10-01",
            numOfVehicle: 873,
            numOfHoursOccupied: 402
        }
    };
}

function getBaseHourQuery(): object {
    return {
        baseHourQuery: {
            title: 'baseHour',
            hour: "12:00:00",
            numOfVehicle: 89,
            numOfHoursOccupied: 46,
            
        }
    };
}

function getUserQuery(): object {
    return {
        userQuery: {
            title: 'user',
            userId: "12345",
            numOfParking: 16,
            theAllParkingTime: 30,
            averageParkingTime: 1.5
        }
    };
}

function getFullHourQuery(): object {
    return {
        fullHourQuery: {
            title: 'fullHour',
            hour: "12:00:00",
            numOfVehicle: 89,
            numOfHoursOccupied: 46
        }
    };
}

function getFullDayQuery(): object {
    return {
        fullDayQuery: {
            title: 'fullDay',
            day: "2023-10-01",
            numOfVehicle: 909,
            numOfHoursOccupied: 1008
        }
    };
}

export {
    getBaseDayQuery,
    getBaseMonthQuery,
    getBaseHourQuery,
    getUserQuery,
    getFullHourQuery,
    getFullDayQuery
};
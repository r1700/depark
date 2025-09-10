import sequelize from "../../config/sequelize";
import { QueryTypes } from "sequelize";

function calculatePercentageChange(current: number, previous: number): number {
    if (!previous || isNaN(previous)) return 0;
    return ((current - previous) / previous) * 100;
}

export async function getUserAndCarStats() {
    const activeUsers = await sequelize.query(
        `SELECT COUNT(*) as count FROM users WHERE status = 2`,
        { type: QueryTypes.SELECT }
    );

    const activeUsersLastMonth = await sequelize.query(
        `SELECT COUNT(users.id) AS count
     FROM users
     JOIN baseuser ON users.baseuser_id = baseuser.id
     WHERE users.status = 2
       AND baseuser.created_at <= (CURRENT_DATE - INTERVAL '1 month')`,
        { type: QueryTypes.SELECT }
    );

    const totalAllowedCars = await sequelize.query(
        `SELECT SUM(max_cars_allowed_parking) as total FROM users`,
        { type: QueryTypes.SELECT }
    );

    const totalAllowedCarsLastMonth = await sequelize.query(
        `SELECT SUM(max_cars_allowed_parking) as total
     FROM users
     JOIN baseuser ON users.baseuser_id = baseuser.id
     WHERE baseuser.created_at <= (CURRENT_DATE - INTERVAL '1 month')`,
        { type: QueryTypes.SELECT }
    );

    const currentActiveUsers = Number((activeUsers[0] as any)?.count) || 0;
    const previousActiveUsers = Number((activeUsersLastMonth[0] as any)?.count) || 0;

    const currentAllowedCars = Number((totalAllowedCars[0] as any)?.total) || 0;
    const previousAllowedCars = Number((totalAllowedCarsLastMonth[0] as any)?.total) || 0;

    return {
        activeUsers: currentActiveUsers,
        activeUsersChangePercent: calculatePercentageChange(currentActiveUsers, previousActiveUsers),
        totalAllowedCars: currentAllowedCars,
        totalAllowedCarsChangePercent: calculatePercentageChange(currentAllowedCars, previousAllowedCars),
    };
}

export async function getSystemHealthStatsWithChange() {
    const query = `
    SELECT DISTINCT ON (component)
           CASE component
             WHEN 1 THEN 'OPC Bridge'
             WHEN 2 THEN 'API Server'
             WHEN 3 THEN 'Database'
             WHEN 4 THEN 'WebSocket Server'
             WHEN 5 THEN 'Government Sync'
           END AS component_name,
           CASE status
             WHEN 1 THEN 'Healthy'
             WHEN 2 THEN 'Warning'
             WHEN 3 THEN 'Error'
           END AS status_label,
           timestamp
    FROM systemhealths
    ORDER BY component, timestamp DESC;
  `;

    const results = await sequelize.query(query, { type: QueryTypes.SELECT });
    return results.map((r: any) => ({
        component: r.component_name,
        status: r.status_label,
    }));
}

export const ActiveRetrievalRequests = async () => {
    const waitingRetrievals = await sequelize.query(
        `SELECT COUNT(*)::int AS count
    FROM "retrievalqueues"
    WHERE "status" IN (1,2,3)`,
        { type: QueryTypes.SELECT }
    );
    const waitingLastMonth = await sequelize.query(
        `SELECT COUNT(*)::int AS count
         FROM "retrievalqueues"
         WHERE "status" IN (1,2,3)
           AND "requested_at" <= (CURRENT_DATE - INTERVAL '1 month')`,
        { type: QueryTypes.SELECT }
    );
    const avgWaitTimeToday = await sequelize.query(
        `SELECT COALESCE(
           AVG(EXTRACT(EPOCH FROM ("exit_time" - "retrieval_request_time")) / 60),
           0
       ) AS "averageWaitTime"
     FROM "parkingsessions"
     WHERE "status" = 2
       AND "retrieval_request_time" IS NOT NULL
       AND "exit_time" IS NOT NULL
       AND DATE("retrieval_request_time") = CURRENT_DATE`,
        { type: QueryTypes.SELECT }
    );
    const avgWaitTimeYesterday = await sequelize.query(
        `SELECT COALESCE(
           AVG(EXTRACT(EPOCH FROM ("exit_time" - "retrieval_request_time")) / 60),
           0
       ) AS "averageWaitTime"
     FROM "parkingsessions"
     WHERE "status" = 2
       AND "retrieval_request_time" IS NOT NULL
       AND "exit_time" IS NOT NULL
       AND DATE("retrieval_request_time") = CURRENT_DATE - INTERVAL '1 day'`,
        { type: QueryTypes.SELECT }
    );
    const cancelledOrNotRetrieved = await sequelize.query(
        `SELECT COUNT(*)::int AS count
         FROM "parkingsessions"
         WHERE "status" = 4
         AND "exit_time" IS NULL`,
        { type: QueryTypes.SELECT }
    );
    const cancelledOrNotRetrievedlastMonth = await sequelize.query(
        `SELECT COUNT(*)::int AS count
         FROM "parkingsessions"
         WHERE "status" = 2
          AND "exit_time" IS NULL
          AND "retrieval_request_time" <= (CURRENT_DATE - INTERVAL '1 month')`,
        { type: QueryTypes.SELECT }
    );
    const currentWaiting = Number((waitingRetrievals[0] as any)?.count) || 0;
    const previousWaiting = Number((waitingLastMonth[0] as any)?.count) || 0;
    const currentAvg = Number((avgWaitTimeToday[0] as any)?.averageWaitTime) || 0;
    const previousAvg = Number((avgWaitTimeYesterday[0] as any)?.averageWaitTime) || 0;
    const currentcancelledCount = Number((cancelledOrNotRetrieved[0] as any)?.count) || 0;
    const previousCancelledCount = Number((cancelledOrNotRetrievedlastMonth[0] as any)?.count) || 0;
    return {
        waitingRetrievals: currentWaiting,
        waitingRetrievalsChangePercecent: calculatePercentageChange(currentWaiting, previousWaiting),
        avgWaitTime: currentAvg,
        avgWaitTimeChangePercent: calculatePercentageChange(currentAvg, previousAvg),
        cancelledOrNotRetrieved: currentcancelledCount,
        cancelledOrNotRetrievedChangePercent: calculatePercentageChange(currentcancelledCount, previousCancelledCount),
    };
};

export async function getDashboardSnapshot() {
    const [userAndCarStats, systemHealthStats, activeRetrievalRequests] = await Promise.all([
        getUserAndCarStats(),
        getSystemHealthStatsWithChange(),
        ActiveRetrievalRequests()
    ]);

    return {
        userAndCarStats,
        systemHealthStats,  
        activeRetrievalRequests
    };
}

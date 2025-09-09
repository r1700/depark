import { QueueItem, db } from "./db";

    const url = process.env.REACT_APP_API_URL || 'http://localhost:3001';

async function fetchQueue(): Promise<QueueItem[]> {
    // const res = await fetch("/api/opc/Queue/:floorNumber?"); 
    const res = await fetch(`${url}/opc/Queue`);
    console.log("Fetching queue data from API!!  ", res);

    if (!res.ok) throw new Error("Failed to fetch queue");
    return await res.json() as QueueItem[];
    // return await fetchQueueMock()
}

export async function getQueue(): Promise<{ data: QueueItem[]; from: "server" | "cache" }> {
    if (navigator.onLine) {
        try {
            const data = await fetchQueue();
            await db.queue.clear();
            await db.queue.bulkPut(data);
            return { data, from: "server" };
        } catch (err) {
            console.warn("❌ server failed, using cache", err);
        }
    }
    const data = await db.queue.toArray();
    return { data, from: "cache" };
}

export async function getQueueByFloor(floor: number): Promise<{ data: QueueItem | null; from: "server" | "cache" }> {
    try {
        const { data, from } = await getQueue();
        const floorData = data.find(q => q.floorNumber === floor) || null;
        return { data: floorData, from };
    } catch (err) {
        console.warn("❌❌ getQueueByFloor failed", err);
        throw err;
    }
}




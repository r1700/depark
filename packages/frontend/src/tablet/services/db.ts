import Dexie, { Table } from "dexie";

// מבנה פנימי של רכב בתור
export interface QueueEntry {
  licensePlate: string;
  carsCount: number;
}

// קומת חניה עם תור
export interface QueueItem {
  id?: number;           
  floorNumber: number;    
  queue: QueueEntry[]; 
}

// Dexie DB

export class QueueDB extends Dexie {
  queue!: Table<QueueItem, number>;
  constructor() {
    super("QueueDB");
    this.version(1).stores({
      queue: "floorNumber" 
    });
  }
}

export const db = new QueueDB();

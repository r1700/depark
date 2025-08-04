import RetrievalQueue from '../../model/database-models/retrievalQueue.model';
import axios, { AxiosResponse } from 'axios';
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const { APLICATION_QUOTA }: any = process.env || 'development';
let aplicsationQuota: number = APLICATION_QUOTA;

const StatusMapping: { [key: number]: string } = {
  0: 'queued',
  1: 'processing',
  2: 'ready',
  3: 'completed',
};

async function getAllQueues() {
  const queues = await RetrievalQueue.findAll();
  const mappedQueues = queues.map(queue => ({
    ...queue.toJSON(),
    status: StatusMapping[queue.status], // Convert status to string
  }));
  console.log('Mapped Queues:', mappedQueues);
}

async function getProcessingQueues() {
  try {
    const processingQueues = await RetrievalQueue.findAll({
      where: {
        status: 1, // Use the numeric value for 'processing'
      },
    });

    console.log('Processing Queues:', processingQueues.map(queue => queue.toJSON()));
    return processingQueues;
  } catch (error) {
    console.error('Error fetching processing queues:', error);
    throw error;
  }
}

async function getFirstQueuedQueue() {
  try {
    const firstQueuedQueue = await RetrievalQueue.findOne({
      where: {
        status: 0, // Find the first record where status is 0
      },
      order: [['id', 'ASC']], // Sort by id in ascending order (optional)
    });

    if (firstQueuedQueue) {
      console.log('First Queued Queue:', firstQueuedQueue.toJSON());
    } else {
      console.log('No queued queues found.');
    }

    return firstQueuedQueue;
  } catch (error) {
    console.error('Error fetching first queued queue:', error);
    throw error;
  }
}

async function sendToOpc(endpoint: string, data: any): Promise<AxiosResponse<any>> {
  try {
    const baseUrl = 'http://localhost:5000'; // Backend base URL
    const url = `${baseUrl}${endpoint}`; // Combine base URL with the provided endpoint
    const response = await axios.post(url, data); // Send the request
    console.log('Response from Backend:', response.data); // Log the response
    return response; // Return the response
  } catch (error: any) {
    console.error('Error sending data to Backend:', error.message);
    throw error; // Throw the error to handle it elsewhere
  }
}

export async function vehicleQueueService() {
  if (!APLICATION_QUOTA) {
    throw new Error('APLICATION_QUOTA is not defined in environment variables');
  }
  console.log(`Application Quota: ${APLICATION_QUOTA}`, `aplicationQuota: ${aplicsationQuota}`);
  if (aplicsationQuota < APLICATION_QUOTA) {
    const firstQueuedQueue = await getFirstQueuedQueue();
    if (firstQueuedQueue) {
      try {
        // Use the general function to send data
        const response = await sendToOpc('/plc/write/licensePlateExit/parkingSpot', {
          licensePlateExit: firstQueuedQueue.license_plate,
          parkingSpot: firstQueuedQueue.underground_spot,
        });
        aplicsationQuota++;
        console.log('Response from OPC API:', response.data);
      } catch (error: any) {
        console.error('Error sending data to OPC API:', error.message);
      }
    }

  }
  else {
    const processingQueues = await getProcessingQueues();
    aplicsationQuota = processingQueues.length;
  }
  console.log("Vehicle Queue Service initialized");
}
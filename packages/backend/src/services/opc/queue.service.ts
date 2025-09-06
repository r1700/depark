import RetrievalQueue from '../../model/database-models/retrievalQueue.model';
import axios, { AxiosResponse } from 'axios';
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const { APLICATION_QUOTA }: any = process.env || 'development';
let applicationQuota: number = APLICATION_QUOTA;

const StatusMapping: { [key: number]: string } = {
  1: 'queued',
  2: 'processing',
  3: 'ready',
  4: 'completed',
};

// Function to fetch all queues
async function getAllQueues() {
  try {
    const queues = await RetrievalQueue.findAll();
    const mappedQueues = queues.map(queue => ({
      ...queue.toJSON(),
      status: StatusMapping[queue.status], // Convert status to string
    }));
    console.log('Mapped Queues:', mappedQueues);
    return mappedQueues;
  } catch (error) {
    console.error('Error fetching all queues:', error);
    throw new Error('Failed to fetch all queues');
  }
}

// Function to fetch all processing queues
async function getProcessingQueues() {
  try {
    const processingQueues = await RetrievalQueue.findAll({
      where: {
        status: 2, // Use the numeric value for 'processing'
      },
    });

    console.log('Processing Queues:', processingQueues.map(queue => queue.toJSON()));
    return processingQueues;
  } catch (error) {
    console.error('Error fetching processing queues:', error);
    throw new Error('Failed to fetch processing queues');
  }
}

// Function to fetch the first queued queue
async function getFirstQueuedQueue() {
  try {
    const firstQueuedQueue = await RetrievalQueue.findOne({
      where: {
        status: 1, // Find the first record where status is queued
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
    throw new Error('Failed to fetch first queued queue');
  }
}

// Function to send data to the OPC server
async function sendToOpc(endpoint: string, data: any): Promise<AxiosResponse<any>> {
  try {
    const baseUrl = 'http://localhost:5000'; // Backend base URL
    const url = `${baseUrl}${endpoint}`; // Combine base URL with the provided endpoint
    console.log(`Sending data to OPC server at ${url} with data:`, data);

    const response = await axios.post(url, data); // Send the request
    console.log('Response from OPC server:', response.data); // Log the response
    return response; // Return the response
  } catch (error: any) {
    console.error('Error sending data to OPC server:', error.message);
    throw new Error(`Failed to send data to OPC server at ${endpoint}`);
  }
}

// Main vehicle queue service function
export async function vehicleQueueService() {
  console.log('Initializing Vehicle Queue Service...');
  
  if (!APLICATION_QUOTA) {
    throw new Error('APLICATION_QUOTA is not defined in environment variables');
  }

  console.log(`Application Quota: ${APLICATION_QUOTA}`, `Current Quota: ${applicationQuota}`);

  if (applicationQuota < APLICATION_QUOTA) {
    const firstQueuedQueue = await getFirstQueuedQueue();
    if (firstQueuedQueue) {
      try {
        // Use the general function to send data
        const response = await sendToOpc('/plc/write/licensePlateExit', {
          licensePlateExit: firstQueuedQueue.license_plate,
        });
        applicationQuota++;
        console.log('Response from OPC API:', response.data);
      } catch (error: any) {
        console.error('Error sending data to OPC API:', error.message);
      }
    }
  } else {
    const processingQueues = await getProcessingQueues();
    applicationQuota = processingQueues.length;
  }

  console.log('Vehicle Queue Service initialized');
}
import cron from 'node-cron';
import { vehicleQueueService } from './services/opc/queue.service';

// Schedule the vehicleQueueService to run every second
cron.schedule('* * * * * *', async () => {
    try {
        console.log('Starting vehicleQueueService...');
        await vehicleQueueService(); // Wait for the service to complete
        console.log('vehicleQueueService completed.');
    } catch (error) {
        console.error('Error in vehicleQueueService:', error);
    }
});
import app from "./app"; // Import the Express app
import { createMonitoredItems, createSubscription } from "./opc-client"; // Import the OPC UA functions
import dotenv from 'dotenv';
dotenv.config();

const { PORT } = process.env || { PORT: 5000 };

app.listen(PORT, async () => {
  console.log(`API server running on port ${PORT}`);

  try {
    // Create a subscription        
    const subscription = await createSubscription();
    console.log("Subscription created successfully");

    // Create monitored items
    await createMonitoredItems(subscription);
    console.log("Monitored items created successfully");
  } catch (error) {
    console.error("Error initializing OPC UA monitoring:", error);
  }
});
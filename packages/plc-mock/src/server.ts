import { createPlcMockServer } from './plc-mock';

// Create an instance of the server
const app = createPlcMockServer();

// Open listening to an external server (e.g. frontend or gateway server)
 const PORT = 4080;
app.listen(PORT, () => {
  console.log(`🔌 PLC Mock Server running on http://localhost:${PORT}`);
});

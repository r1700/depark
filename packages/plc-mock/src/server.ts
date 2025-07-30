import { createPlcOpcServer } from './plc-mock';

// Create an instance of the server
const app = createPlcOpcServer();

// Open listening to an external server (e.g. frontend or gateway server)
 
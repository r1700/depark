import app from "./app"; // ודאי ש־app.ts מייצא את ה־express app שלך
import dotenv from 'dotenv';
dotenv.config();

const {PORT} = process.env || { PORT: 5000 };


app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});


import { subscribeToPlcMock } from "./opcClient";

subscribeToPlcMock();

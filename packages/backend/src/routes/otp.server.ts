import express from 'express';
import bodyParser from 'body-parser';
import { handleCreateOtp, handleVerifyOtp } from '../controllers/otp.controller';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());

// create OTP
app.post('/otp/create', handleCreateOtp);

// verify OTP
app.post('/otp/verify', handleVerifyOtp);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


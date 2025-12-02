import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
import authRoutes from './routes/authRoute.js';
import errorHandler from './Middlewares/errorHandler.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json()); // To parse JSON bodies
// NEW: Add cookie-parser middleware
app.use(cookieParser()); 

// --- Use Auth Routes ---
app.use('/api/auth', authRoutes);

// --- Simple Root Route ---
app.get('/', (req, res) => {
  res.send('Welcome to the Plagiarism Backend API.');
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
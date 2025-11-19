import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoute.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json()); // To parse JSON bodies

// --- Use Auth Routes ---
app.use('/api/auth', authRoutes);

// --- Simple Root Route ---
app.get('/', (req, res) => {
  res.send('Welcome to the Plagiarism Backend API.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

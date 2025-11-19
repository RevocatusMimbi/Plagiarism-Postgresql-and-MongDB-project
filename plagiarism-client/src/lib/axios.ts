// src/lib/axios.ts

import axios from 'axios';

// IMPORTANT: Ensure this matches your running backend port
const API_BASE_URL = 'http://localhost:5000/api'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
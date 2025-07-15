const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/utils/db');
const transcribeRoute = require('./src/routes/transcribeRoute');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use transcribe route
app.use('/', transcribeRoute);

// Test route
app.get('/', (req, res) => {
  res.send('Voice Evaluation Microservice is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}); 
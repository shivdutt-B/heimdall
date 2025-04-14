const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(morgan('dev'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running' });
});

app.get('/__ping__', (req, res) => {
  // Log the ping request
  console.log('Ping received at:', new Date().toISOString());
  
  // Return a simple response with timestamp and memory usage
  res.json({
    status: 'ok',
    message: 'Ping successful',
    timestamp: new Date().toISOString(),
    memory: {
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100, // MB (rounded to 2 decimal places)
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100 // MB (rounded to 2 decimal places)
    }
  });
});

// Server status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    memory: process.memoryUsage().heapUsed / 1024 / 1024, // MB
  });
});

// Simulate different response times
app.get('/delay/:ms', (req, res) => {
  const delay = parseInt(req.params.ms) || 0;
  setTimeout(() => {
    res.json({ message: `Response delayed by ${delay}ms` });
  }, delay);
});

// Simulate error responses
app.get('/error/:code', (req, res) => {
  const code = parseInt(req.params.code) || 500;
  res.status(code).json({ error: `Simulated ${code} error` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start servers on 5 consecutive ports
const BASE_PORT = parseInt(process.env.PORT || 3000);
const NUM_SERVERS = 5;

for (let i = 0; i < NUM_SERVERS; i++) {
  const port = BASE_PORT + i;
  app.listen(port, () => {
    console.log(`Test server running on port ${port}`);
  });
}

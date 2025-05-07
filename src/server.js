const express = require('express');
const app = express();
const PORT = 6000;

// Middleware to parse JSON
app.use(express.json());

// Sample diagnostics data
const diagnosticData = {
  engineStatus: 'Healthy',
  batteryLevel: '85%',
  oilLevel: 'Optimal',
  errorCodes: ['P0420', 'P0303'],
};

// Endpoint to serve diagnostics data
app.get('/api/diagnostics', (req, res) => {
  res.json(diagnosticData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

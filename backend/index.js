require('dotenv').config();
const express = require('express');
const api = require('./api');
const database = require('./database');

/* Application Variables */
const port = process.env.EXPRESS_PORT || 3001;

// The Express Server
const app = express();

// Application Middleware

/* Parses JSON formatted request bodies */
app.use(express.json());
/* Parses requests with url-encoded values */
app.use(express.urlencoded({ extended: false}));

app.use('/api', api);

/* Event handler for failed reconnection to database */
database.on('reconnectFailed', () => {
  console.log('After retries, failed to reconnect to database. Gracefully closing Express server');
  app.close(() => console.log('Express server closed'));
});

/**
 * Only start the server the first time this event is emitted
 * Mongoose emits this signal every time the database connects,
 * even after successful reconnects
 */
database.once('connected', () => {
  // Starts the Express server
  app.listen(port, () => {
    console.log(`Express API server started on port ${port}`);
  });
});

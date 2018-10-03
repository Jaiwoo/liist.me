'use strict';

//
// ─── APP SETUP ──────────────────────────────────────────────────────────────────
//

// EXPRESS
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// MONGOOSE
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// DATABASE & PORT CONFIGURATION
const { PORT, DATABASE_URL } = require('./config');

// ROUTERS
const liistsRouter = require('./liistsRouter');
const usersRouter = require('./usersRouter');

// DEFINE APP
const app = express();
app.use(express.static('public'));
app.use(morgan('common'));
app.use(cookieParser());

//
// ─── ROUTERS AND ENDPOINTS ───────────────────────────────────────────────────────
//

// /LIISTS
app.use('/liists', liistsRouter);

// /USERS
app.use('/users', usersRouter);

// CATCH-ALL
app.use('*', function(req, res) {
  res.status(404).json({ message: 'Resource Not Found' });
});

//
// ─── SERVER LOGIC ───────────────────────────────────────────────────────────────
//

let server;

function runServer (databaseURL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseURL,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}! Database URL is ${databaseURL}`);
            resolve();
          })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log(`Closing Server`);
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// START SERVER
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

//
// ─── EXPORTS ────────────────────────────────────────────────────────────────────
//

module.exports = { app, runServer, closeServer };
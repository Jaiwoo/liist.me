'use strict';

//
// ─── APP SETUP ──────────────────────────────────────────────────────────────────
//

const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = express();
app.use(express.static('public'));

// DATABASE & PORT CONFIGURATION
const { PORT, DATABASE_URL } = require('./config');

// TODO: REQUIRE MODELS & SCHEMA

// TODO: IMPLEMENT & REQUIRE ROUTER & ENDPOINTS

//
// ─── CATCH-ALL ENDPOINT ─────────────────────────────────────────────────────────
//

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
            console.log(`Your app is listening on port ${port}!`);
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

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

//
// ─── EXPORTS ────────────────────────────────────────────────────────────────────
//

module.exports = { app, runServer, closeServer };
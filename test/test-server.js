'use strict';

//
// ─── IMPORTS AND SETUP ──────────────────────────────────────────────────────────
//

const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {Liist} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;
chai.use(chaiHTTP);

//
// ─── SEED TEST DATABASE ─────────────────────────────────────────────────────────
//

function seedLiistData () {
  console.log('Seeding test Liist data');

  const seedData = [];
  const dataBaseLength = Math.floor(Math.random() * (50 - 5 + 1)) + 5;

  for (let i=0; i<=dataBaseLength; i++) {
    seedData.push(generateLiistData());
  }

  // INSERT SEED DATA TO MONGO
  return Liist.insertMany(seedData);
}

function generateSongs () {
  const songsArray = [];
  const liistLength = Math.floor(Math.random() * (50 - 5 + 1)) + 5;

  for (let i=0; i<=liistLength; i++) {
    const songObj = {
      title: faker.lorem.words(),
      artist: faker.name.findName(),
      addedBy: faker.internet.userName(),
      addedDate: faker.date.recent(),
      likes: Math.floor(Math.random() * (50 - 5 + 1)) + 5
    };
    songsArray.push(songObj);
  }

  return songsArray;
}

function generateLiistData () {
  return {
    owner: faker.internet.userName(),
    name: faker.lorem.words(),
    description: faker.lorem.sentence(),
    updatedDate: faker.date.recent(),
    songs: generateSongs()
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

//
// ─── TEST SUITES ────────────────────────────────────────────────────────────────
//





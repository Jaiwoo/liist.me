'use strict';

//
// ─── IMPORTS AND SETUP ──────────────────────────────────────────────────────────
//

const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { Liist } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;
chai.use(chaiHTTP);

//
// ─── SEED TEST DATABASE ─────────────────────────────────────────────────────────
//

function seedLiistData() {
  console.log('Seeding test Liist data');

  const seedData = [];
  const dataBaseLength = Math.floor(Math.random() * (50 - 5 + 1)) + 5;

  for (let i = 0; i <= dataBaseLength; i++) {
    seedData.push(generateLiistData());
  }

  // INSERT SEED DATA TO MONGO
  return Liist.insertMany(seedData);
}

function generateSongs() {
  const songsArray = [];
  const liistLength = Math.floor(Math.random() * (50 - 5 + 1)) + 5;

  for (let i = 0; i <= liistLength; i++) {
    const songObj = {
      title: faker.lorem.words(),
      artist: faker.name.findName(),
      addedBy: faker.internet.userName()
    };
    songsArray.push(songObj);
  }

  return songsArray;
}

function generateLiistData() {
  return {
    owner: faker.internet.userName(),
    name: faker.lorem.words(),
    description: faker.lorem.sentence(),
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

describe('Liists API resource', function() {
  // START SERVER & DATABASE CONNECTION
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  // SEED TEST DATA
  beforeEach(function() {
    return seedLiistData();
  });
  // DROP TEST DB
  afterEach(function() {
    return tearDownDb();
  });
  // CLOSE SERVER & DATABASE CONNECTION
  after(function() {
    return closeServer();
  });

  // GET ALL LIISTS AT /LIISTS
  describe('GET to /liists', function() {
    it('should return all existing liists', function() {
      let res;
      return chai
        .request(app)
        .get('/liists')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.liists).to.have.lengthOf.at.least(1);

          return Liist.countDocuments();
        })
        .then(function(count) {
          expect(res.body.liists).to.have.lengthOf(count);
        });
    });

    it('should return liists with the right information', function() {
      let testLiist;
      return chai
        .request(app)
        .get('/liists')
        // inspect response formatting & keys
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.liists).to.be.a('array');
          expect(res.body.liists).to.have.lengthOf.at.least(1);

          res.body.liists.forEach(function(liist) {
            expect(liist).to.be.a('object');
            expect(liist).to.include.keys(
              'id', 'addedDate', 'owner', 'name', 'description', 'songs', 'updatedDate');
          });
          testLiist = res.body.liists[0];
          return Liist.findById(testLiist.id);
        })
        // compare to database
        .then(function(liist) {
          expect(testLiist.id).to.equal(liist.id);
          expect(testLiist.owner).to.equal(liist.owner);
          expect(testLiist.name).to.equal(liist.name);
          expect(testLiist.description).to.equal(liist.description);
          expect(testLiist.songs).to.be.a('array');
          expect(testLiist.songs).to.have.lengthOf.at.least(1);
          expect(testLiist.songs[0].likes).to.equal(liist.songs[0].likes);
          expect(testLiist.songs[0].title).to.equal(liist.songs[0].title);
          expect(testLiist.songs[0].artist).to.equal(liist.songs[0].artist);
          expect(testLiist.songs[0].addedBy).to.equal(liist.songs[0].addedBy);
        });
    });
  });

  // GET TO /LIISTS/:ID
  describe('GET to /liists/:ID', function() {
    it('should return liist that matches specified ID', function() {
      let res;
      let liistToGet;

      return chai
        // get liists and use 1st index to test endpoint
        .request(app)
        .get('/liists')
        .then(function(_res) {
          res = _res;
          liistToGet = res.body.liists[0];
          return chai
            .request(app)
            .get(`/liists/${liistToGet.id}`);
        })
        // inspect response
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');

          return Liist.findById(liistToGet.id);
        })
        // compare to database
        .then(function(liist) {
          expect(res.body.id).to.equal(liist.id);
          expect(res.body.owner).to.equal(liist.owner);
          expect(res.body.name).to.equal(liist.name);
          expect(res.body.description).to.equal(liist.description);
        });
    });
  });

  // POST TO /LIISTS
  describe('POST to /liists', function() {
    it('should add new liist to db & return serialized version', function() {
      const newLiist = generateLiistData();

      return chai
        .request(app)
        .post('/liists')
        .send(newLiist)
        // inspect response
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'addedDate', 'owner', 'name', 'description', 'songs', 'updatedDate');
          expect(res.body.id).to.not.be.null;
          expect(res.body.name).to.equal(newLiist.name);
          expect(res.body.owner).to.equal(newLiist.owner);
          expect(res.body.description).to.equal(newLiist.description);
          expect(res.body.songs).to.be.a('array');
          expect(res.body.updatedDate).to.not.be.null;
          expect(res.body.addedDate).to.not.be.null;

          return Liist.findById(res.body.id);
        })
        // check db data matches test data
        .then(function(liist) {
          expect(liist.owner).to.equal(newLiist.owner);
          expect(liist.name).to.equal(newLiist.name);
          expect(liist.description).to.equal(newLiist.description);
        });
    });
  });

  // PUT TO /LIISTS/:ID
  describe('PUT to /liist/:id', function() {
    it('should add song to liist by ID', function() {
      // generate song to add
      const songObj = {
        title: faker.lorem.words(),
        artist: faker.name.findName(),
        addedBy: faker.internet.userName()
      };
      let liistId;
      // get random liist from db then PUT to its ID
      return Liist
        .findOne()
        .then(function(liist) {
          liistId = liist.id;
          return chai
            .request(app)
            .put(`/liists/${liistId}/songs`)
            .send(songObj);
        })
        // inspect response
        .then(function(res) {
          expect(res).to.have.status(201);
          
          return Liist.findById(liistId);
        })
        // inspect if db was updated properly
        .then(function(liist) {
          const liistLength = liist.songs.length - 1;
          expect(liist.songs[liistLength].title).to.equal(songObj.title);
          expect(liist.songs[liistLength].artist).to.equal(songObj.artist);
          expect(liist.songs[liistLength].addedBy).to.equal(songObj.addedBy);
        });
    });
  });

  // DELETE TO /LIISTS/:ID/SONGS
  describe('DELETE to /liists/:id to delete song from liist', function() {
    it('should delete specific song from liist & db by ID in body', function() {
      // first get a liist item from db for testing
      let liist;
      let songID;
      let liistLength;

      return Liist
        .findOne()
        .then(function(_liist) {
          liist = _liist;
          songID = liist.songs[0].id;
          liistLength = liist.songs.length;

          const requestBody = {
            songID: songID
          };

          return chai
            .request(app)
            .delete(`/liists/${liist.id}/songs`)
            .send(requestBody);
        })
        // inspect response and return call to db to ensure deletion
        .then(function(res) {
          expect(res).to.have.status(200);
          return Liist.findById(liist.id);
        })
        // check db for song deletion
        .then(function(_liist) {
          const songIndex = _liist.songs.findIndex(function(element) {
            return element.id == songID;
          });
          expect(_liist.songs.length).to.equal(liistLength - 1);
          expect(songIndex).to.equal(-1);
        });
    });
  });

  // DELETE TO /LIISTS/:ID
  describe('DELETE to /liists/:id', function() {
    it('should delete liist from DB by ID', function() {
      let liist;

      return Liist
        .findOne()
        .then(function(_liist) {
          liist = _liist;
          return chai
            .request(app)
            .delete(`/liists/${liist.id}`);
        })
        // inspect response and return call to db
        .then(function(res) {
          expect(res).to.have.status(200);
          return Liist.findById(liist.id);
        })
        // check db for deletion
        .then(function(_liist) {
          expect(_liist).to.be.null;
        });
    });
  });
});

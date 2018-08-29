'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../server.js');

const expect = chai.expect;

chai.use(chaiHTTP);

// welcome page
describe('welcome page', function() {
  it('should load at / & return status 200', function() {
    return chai
      .request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});

// create page
describe('create page', function() {
  it('should load at /create & return status 200', function() {
    return chai
      .request(app)
      .get('/create')
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});

// recents page
describe('recents page', function() {
  it('should load at /recents & return status 200', function() {
    return chai
      .request(app)
      .get('/recents')
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});

// liist page
describe('liist page', function() {
  it('should load at /liist & return status 200', function() {
    return chai
      .request(app)
      .get('/liist')
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});
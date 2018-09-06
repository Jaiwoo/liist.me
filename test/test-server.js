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
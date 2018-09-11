'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Liist } = require('./models');


// TODO: BUILD OUT LIISTS ENDPOINT FUNCTIONS

// GET /LIISTS
router.get('/', (req, res) => {
  Liist
    .find()
    .then(liists => {
      res.json({
        liists: liists.map(
          (liist) => liist.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error.'});
    });
});


//
// ─── EXPORTS ────────────────────────────────────────────────────────────────────
//

module.exports = router;
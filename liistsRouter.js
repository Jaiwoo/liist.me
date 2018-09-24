'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Liist } = require('./models');

<<<<<<< HEAD

// TODO: BUILD OUT LIISTS ENDPOINT FUNCTIONS



=======
//
// ─── ENDPOINTS ──────────────────────────────────────────────────────────────────
//

// GET /LIISTS (GET ALL LIISTS)
router.get('/', (req, res) => {
  Liist.find()
    .then(liists => {
      res.json({
        liists: liists.map(liist => liist.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error.' });
    });
});

// GET /LIISTS/:ID (GET ALL LIISTS)
router.get('/:id', (req, res) => {
  Liist.findById(req.params.id)
    .then(liist => {
      res.json(liist.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error.' });
    });
});

// POST /LIISTS (ADD NEW LIIST)
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['owner', 'name', 'description'];
  for (let i=0; i< requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Request body is missing ${field} field`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  // add new liist to db
  Liist
    .create({
      owner: req.body.owner,
      name: req.body.name,
      description: req.body.description})
    .then(
      liist => res.status(201).json(liist.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error.' });
    });
});

// PUT /LIISTS:ID/SONGS (ADD NEW SONG TO LIIST)
router.put('/:id/songs', jsonParser, (req, res) => {
  const requiredFields = ['title', 'artist', 'addedBy'];
  for (let i=0; i< requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Request body is missing ${field} field`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  let songToAdd = {
    addedBy: req.body.addedBy,
    title: req.body.title,
    artist: req.body.artist};

  // add song to liist in db
  Liist
    .findByIdAndUpdate(req.params.id, { '$push': { 'songs': songToAdd } }, { 'new': true })
    .then(liist => res.status(201).json(liist.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error.' });
    });
});

// DELETE /LIISTS/:ID/SONGS (DELETE SONG FROM LIIST BY ID)
router.delete('/:id/songs', jsonParser, (req, res) => {
  const requiredFields = ['songID'];
  for (let i=0; i< requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Request body is missing ${field} field`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  let songID = req.body.songID;

  Liist.findByIdAndUpdate(req.params.id, { '$pull': { 'songs': { '_id': songID } } }, { 'new': true })
    .then(liist => {
      res.status(200).json(liist.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error.' });
    });
});

// DELETE /LIISTS/:ID (DELETE LIIST)
router.delete('/:id', (req, res) => {
  Liist.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(200);
      res.json({
        message: 'liist deleted successfully'
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error.' });
    });
});
>>>>>>> feature/API_Router

//
// ─── EXPORTS ────────────────────────────────────────────────────────────────────
//

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> feature/API_Router

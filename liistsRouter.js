'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Liist } = require('./models');

//
// ─── ENDPOINTS ──────────────────────────────────────────────────────────────────
//

// GET /LIISTS (GET ALL LIISTS)
router.get('/', (req, res) => {
  Liist.find({ owner: `${req.cookies.userID}`})
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
  const requiredFields = ['name', 'description'];
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
      owner: req.cookies.userID,
      name: req.body.name,
      description: req.body.description})
    .then(
      liist => res.status(201).json(liist.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error.' });
    });
});

// PUT /LIISTS:ID (EDIT LIIST INFO)
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'description'];
  for (let i=0; i< requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Request body is missing ${field} field`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  let updatedInfo = {
    name: req.body.name,
    description: req.body.description};

  // update liist in db
  Liist
    .findByIdAndUpdate(req.params.id, { 'name': updatedInfo.name, 'description': updatedInfo.description }, { 'new': true })
    .then(liist => res.status(201).json(liist.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// POST /LIISTS:ID/SONGS (ADD NEW SONG TO LIIST)
router.post('/:id/songs', jsonParser, (req, res) => {
  const requiredFields = ['title', 'artist'];
  for (let i=0; i< requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Request body is missing ${field} field`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  let songToAdd = {
    addedBy: req.cookies.userID,
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

//
// ─── EXPORTS ────────────────────────────────────────────────────────────────────
//

module.exports = router;
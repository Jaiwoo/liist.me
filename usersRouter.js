'use strict';

const express = require('express');
const router = express.Router();

const { User } = require('./models');

//
// ─── ENDPOINTS ──────────────────────────────────────────────────────────────────
//

// GET /USERS
router.get('/:userEmail', (req, res) => {
  const userEmail = req.params.userEmail;

  User.findOne({ userEmail: userEmail }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error.' });
    }
    else if (user === null) {
      User
        .create({userEmail: userEmail})
        .then(function(user) {
          res.cookie('userID', `${user._id}`);
          res.status(200).json({ message: 'New user created.' });
        });
    }
    else {
      res.cookie('userID', `${user._id}`);
      res.status(200).json({ message: 'User found in the database.' });
    }
  });
});


//
// ─── EXPORTS ────────────────────────────────────────────────────────────────────
//

module.exports = router;

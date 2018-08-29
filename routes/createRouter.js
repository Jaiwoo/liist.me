
const express = require('express');
const router = express.Router();

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

const sendFileOptions = {
  root: './public/',
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};

//
// ─── MIDDLEWARE ──────────────────────────────────────────────────
//

router.get('/', function(req, res) {
  res.sendFile('/pages/create.html', sendFileOptions);
});



//
// ─── EXPORTS ──────────────────────────────────────────────────────
//

module.exports = router;
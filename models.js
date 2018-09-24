'use strict';

const mongoose = require('mongoose');

//
// ─── LIIST SCHEMA ───────────────────────────────────────────────────────────────
//

const liistSchema = mongoose.Schema({
<<<<<<< HEAD
  owner: {type: String, required: true},
  name: {type: String, required: true},
  description: String,
  length: {type: Number, default: 0},
  updatedDate: {type: Date, default: Date.now},
  songs: [{
    title: {type: String, required: true},
    artist: {type: String, required: true},
    addedBy: {type: String, required: true},
    addedDate: {type: Date, default: Date.now},
    likes: {type: Number, default: 0}
  }]
=======
  addedDate: { type: Date, default: Date.now },
  owner: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  songs: [
    {
      title: { type: String, required: true },
      artist: { type: String, required: true },
      addedBy: { type: String, required: true },
      addedDate: { type: Date, default: Date.now },
      likes: { type: Number, default: 0 }
    }
  ],
  updatedDate: { type: Date, default: Date.now }
>>>>>>> feature/API_Router
});

// SERIALIZE METHOD
liistSchema.methods.serialize = function() {
  return {
    id: this._id,
<<<<<<< HEAD
    owner: this.owner,
    name: this.name,
    description: this.description,
    length: this.songs.length,
    updatedDate: this.updatedDate,
    songs: this.songs,
=======
    addedDate: this.addedDate,
    owner: this.owner,
    name: this.name,
    description: this.description,
    updatedDate: this.updatedDate,
    songs: this.songs,
    numOfSongs: this.songs.length
>>>>>>> feature/API_Router
  };
};

// DEFINE LIIST MODEL
<<<<<<< HEAD
const Liist = mongoose.model('Liist', liistSchema);
=======

const Liist = mongoose.models.Liist || mongoose.model('Liist', liistSchema);
>>>>>>> feature/API_Router

//
// ─── EXPORTS ────────────────────────────────────────────────────────────────────
//

module.exports = { Liist };
<<<<<<< HEAD

=======
>>>>>>> feature/API_Router

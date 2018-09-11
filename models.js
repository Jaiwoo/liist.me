'use strict';

const mongoose = require('mongoose');

//
// ─── LIIST SCHEMA ───────────────────────────────────────────────────────────────
//

const liistSchema = mongoose.Schema({
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
});

// SERIALIZE METHOD
liistSchema.methods.serialize = function() {
  return {
    id: this._id,
    owner: this.owner,
    name: this.name,
    description: this.description,
    length: this.songs.length,
    updatedDate: this.updatedDate,
    songs: this.songs,
  };
};

// DEFINE LIIST MODEL
const Liist = mongoose.model('Liist', liistSchema);

//
// ─── EXPORTS ────────────────────────────────────────────────────────────────────
//

module.exports = { Liist };
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//
// ─── LIIST SCHEMA ───────────────────────────────────────────────────────────────
//

const userSchema = mongoose.Schema({
  userEmail: { type: String, required: true }
});

const liistSchema = mongoose.Schema({
  addedDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  description: String,
  songs: [
    {
      title: { type: String, required: true },
      artist: { type: String, required: true },
      addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      addedDate: { type: Date, default: Date.now },
      likes: { type: Number, default: 0 }
    }
  ],
});

// HOOKS
liistSchema.pre('findOne', function(next) {
  this.populate('owner');
  next();
});

liistSchema.pre('find', function(next) {
  this.populate('owner');
  next();
});

liistSchema.pre('findById', function(next) {
  this.populate('owner');
  next();
});

// SERIALIZE METHOD
liistSchema.methods.serialize = function() {
  return {
    id: this._id,
    addedDate: this.addedDate,
    owner: this.owner.userEmail,
    name: this.name,
    description: this.description,
    updatedDate: this.updatedDate,
    songs: this.songs,
    numOfSongs: this.songs.length
  };
};

// DEFINE MODELS

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Liist = mongoose.models.Liist || mongoose.model('Liist', liistSchema);

//
// ─── EXPORTS ────────────────────────────────────────────────────────────────────
//

module.exports = { Liist, User };

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
* @class Characters
* @classdesc A user mongoose model that defines the types
*            and structure of the character schema.
* @param {string} name - The in game name of the character.
* @param {number} level - The level of the character.
* @param {publicId} - publicId - The public exposedId of the character
* @param {ObjectId} _userId - The _id of the User this character belongs to.
* @param {string} _heroId - The _id of the Hero type this character is.
*/
module.exports = mongoose.model('Character', {
  name: String,
  level: { type: Number, min: 1, max: 60, default: 1 },
  publicId: String,
  _userId: Schema.Types.ObjectId,
  _heroId: String
});

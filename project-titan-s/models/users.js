const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
* @class users
* @classdesc A user mongoose model that defines the types
*            and structure of the user schema.
* @param {string} email - The email of the user.
* @param {string} credential - The password of the user.
* @param {string} credential2 -The salt of the password of the user
* @param {Date} createDate - The date time the user was createDate
* @param {Date} lastLoginDate - The date time the user user last logged in.
* @param {Date} updateDate - the date time the user was updated
* @param {Array} character - the users list of characters
*/
module.exports = mongoose.model('User', {
  email: String,
  credential: String,
  credential2: String,
  createDate: Date,
  lastLoginDate: Date,
  updateDate: Date,
  characters: [Schema.Types.ObjectId]
});

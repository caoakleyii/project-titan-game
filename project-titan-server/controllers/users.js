const express = require('express');
const router = express.Router();
const Users = require('./../models/users');
const Character = require('./../models/characters');
const _ = require('lodash');
const crypto = require('crypto');
const uuid = require('uuid');

router.post('/', (req, res) => {
  var user = req.body;

  // Validate register request
  if(!user.password){
    return res.status(400).send('Password required.');
  }

  if (user.password.trim().length < 8) {
    return res.status(400).send('Password did not meet validation.');
  }

  if (!user.email) {
    return res.status(400).send('Email required.');
  }

  Users.findOne({ "email" : user.email}, (err, existingUser) => {
    if (existingUser) {
     return res.status(409).send('User Exists');
    }

    // Hash the users password and insert them into the databse.
    let salt = uuid.v4();
    let hash = crypto.createHash('sha256').update(user.password + salt).digest('base64');
    let date = new Date();
    let newUser = {
        email : user.email,
        credential: hash,
        credential2: salt,
        createDate: date,
        updateDate: date
    };

    Users.update({ email: newUser.email }, newUser, { upsert: true }, (err, dbUser) => {
      if (err) {
        console.log('Error registering user', err);
        return res.status(500).send('Internal Server Error');
      }

      return res.status(201).json({ sub: dbUser._id});
    });
  });
});


router.post('/:id/characters', (req, res) => {
  let character = req.body;

  if (!character.name) {
    return res.status(400).send('Name is required.');
  }

  if (!/^[a-z]+$/i.test(character.name)) {
    return res.status(400).send('Name is invalid.');
  }

  Users.findOne({ _id: req.params.id}, (err, user) => {
    if (err) {
      console.log('Error finding user for creation', err);
      return res.status(400);
    }

    if (!user) {
      console.log("User doesn't exist when attmpting to create character", err);
      return res.status(400);
    }

    Character.findOne({ name: character.name}, (err, exitingChar) => {
      console.log(exitingChar);
      if (exitingChar) {
        return res.status(400).send('Character name exists.');
      }

      let char = new Character({ name: character.name, publicId : uuid(),  _userId : user._id, _heroId : character._heroId });

      char.save((err, char) => {
        if (err) {
          console.log('Error creating character', err);
          return res.status(500).send('Internal Server Error');
        }
        user.characters.push(char._id);
        user.save();

        return res.status(201).json({ sub: char._id });
      });
    });
  });

});

router.get('/:id/characters', (req, res) => {
  let response = { characters: [] };

  // find user based off sub.
  Users.findOne({ _id: req.params.id}, (err, user) => {
    if (err) {
      return res.json(response);
    }
    if (!user || !user.characters) {
      return res.json(response);
    }

    // find the characters associated with this user
    Character.find({ '_id': { $in : user.characters }}, (err, characters) => {
        if (err) {
          return res.json(response);
        }
        response.characters = characters;
        return res.json(response);
    });
  });
});

router.post('/credentials/verify', (req, res) => {
  var user = req.body;

  // Validate the login request.
  if (!user.password){
    res.status(400).send('Password required.');
    return;
  }

  if (!user.email) {
    res.status(400).send('Email required.');
    return;
  }

  // Get the user that's attempting to log in.
  Users.findOne({ "email" : user.email}, (err, dbUser) => {

    // validate that we successfully retrieved the user and that they exist.
    if(err){
      console.log('Error attempting to log in a user', err);
      res.status(401).send('Unauthorized');
      return;
    }
    if (!dbUser) {
      res.status(401).send('Unauthorized');
      return;
    }

    // Salt and hash the password they sent and
    // compare it to the salted version.
    let salt = dbUser.credential2;
    let hash = crypto.createHash('sha256').update(user.password + salt).digest('base64');

    if (hash != dbUser.credential) {
      res.status(401).send('Unauthorized');
      return;
    }

    // update last log in date
    dbUser.lastLoginDate = new Date();
    dbUser.save();

    // verified.
    res.status(200).json({ sub: dbUser._id});
    return;
  });
});

module.exports = router;

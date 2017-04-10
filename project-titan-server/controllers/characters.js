const express = require('express');
const router = express.Router();
const Character = require('./../models/characters');
const _ = require('lodash');

router.get('/:id', (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.status(404).send('Not Found');
  }

  Character.findOne({_id : id}, (err, character) => {
    if (err || !character) {
      return res.status(404).send('Not Found');
    }

    return res.status(200).json(character);
  });
});

module.exports = router;

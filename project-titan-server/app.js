'use strict'
const server = require('./game-engine/server.js');
const express = require('express');
const mongoose = require('mongoose');
const usersController = require('./controllers/users');
const charactersController = require('./controllers/characters');
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const PORT = 6543;

// Set up mongo db
mongoose.connect('mongodb://localhost/titan');

// Set up API and API Endpoints
// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// API controllers
app.use('/users', usersController);
app.use('/characters', charactersController);

// Start the HTTP API
app.listen(PORT);

console.log(chalk.green(`HTTP API Server listening on port - ${PORT}`));

// Start UDP Server.
server.start();

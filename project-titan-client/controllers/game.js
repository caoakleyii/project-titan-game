const canvas = document.getElementById('cnvs');
const ctx = canvas.getContext("2d");
const network = require('../network');
const Player = require('../../lib/models/player');
const Vector2 = require('../../lib/core/vector2');
const Systems = require('../../lib/systems/systems');
const Gravity = require('../../lib/systems/gravity');
const World = require('../../lib/world/world');
let sub = localStorage.getItem('character-sub');
let players = [];
let character = JSON.parse(localStorage.getItem('character'));
let stage;
let systems;
let world;

function init() {
  stage = new createjs.Stage('cnvs');
  stage.addEntity = (entity) => {
    stage.addChild(entity);
    systems.addEntity(entity);
  };
  systems = new Systems(new Gravity());

  world = new World('Shaitans', stage);
  createjs.Ticker.setFPS(60);

  if (!network.connected) {
    network.connect(sub);
  }

  let spawn = new Vector2([35, 30]);

  // create local player and add them to stage.
  player = new Player(character, stage, spawn, true, network);
  stage.addEntity(player.hero);

  createjs.Ticker.addEventListener('tick', tick);
}

function onPlayerDisconnect(msg) {
  delete players[msg.data._id];
}

function onPlayerConnect(msg) {

  let char = new Player(
    { _heroId : msg.data.hero._heroId, name: msg.data.name,
    publicId: msg.data._id },
    stage,
    new Vector2(msg.data.hero)
    );

  stage.addEntity(char.hero);
  players[char.publicId] = char;
}

function onPlayerInput(msg) {
  let player = players[msg.data._id];

  if(!player) {
    return;
  }

  player.keysDown = msg.data.keysDown;
}

function tick(event) {
  if (world.map.world){
    // world.map.world.regY += 0.5 * event.delta;
  }
  stage.update(event);
}

// attach network handlers
network.onPlayerDisconnectHandler = onPlayerDisconnect;
network.onPlayerConnectHandler = onPlayerConnect;
network.onPlayerInputHandler = onPlayerInput;

init();

function resize_canvas(){
  world.map.world.regY = ((world.map.mapData.height * world.map.mapData.tileheight) - window.innerHeight);
  $('#cnvs').attr('width', window.innerWidth);
  $('#cnvs').attr('height', window.innerHeight);
}
$(document).ready(resize_canvas);
$(window).resize(resize_canvas);

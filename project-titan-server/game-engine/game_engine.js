require('node-easel');
const Canvas = require('canvas');
const Systems = require('../../lib/systems/systems');
const Gravity = require('../../lib/systems/gravity');
const Stage = createjs.Stage;
const Shape = createjs.Shape;
const Graphics = createjs.Graphics;

class GameEngine {
  constructor(id, socket){
    this.socket = socket;
    this.id = id;
    this.players = [];
    this.systems = undefined;
  }
  start(tickrate) {
    // create world x,y)
    this.canvas = new Canvas(1920,1920);
    this.ctx = this.canvas.getContext('2d');
    this.stage = new createjs.Stage(this.canvas);
    this.stage.addEntity = ((entity) => {
      if(!entity.stage) {
        entity.stage = this.stage;
      }
      this.stage.addChild(entity);
      this.systems.addEntity(entity);      
    }).bind(this);
    createjs.Ticker.setFPS(60);
    this.systems = new Systems(new Gravity());
    createjs.Ticker.addEventListener('tick', this.tick.bind(this));
  }
  connectPlayer(player) {
    this.players[player._id] = player;
    this.stage.addEntity(player.hero);
  }
  disconnectPlayer(player) {
    delete this.players[player._id];
    this.stage.removeChild(player.hero);
  }
  tick(event){
    this.stage.update(event);
  }
}

module.exports = GameEngine;

const Zenobia = require('../heroes/zenobia');
const $ = require('jquery');
const Keybinds = require('../keybinds');
const msgtypes = require('../network_message_types.js');
const herotypes = require('../heroes/hero_types');
const uuid = require('uuid');

if (process.env.server) {
  require('node-easel');
}

class Player{
  constructor(char, stage, position, attachPlayerHandler, network) {
    // create the hero for the player.
    switch(char._heroId) {
        case herotypes.ZENOBIA:
          this.hero = new Zenobia();
          break;
        default:
          break;
    }
    this._id = undefined;
    this.publicId = char.publicId;
    this.name = char.name;
    this.stage = stage;
    this.remote = undefined;
    this.keysDown = {};
    this.hero.x = position.x;
    this.hero.y = position.y;
    this.playerHandlerAttached = attachPlayerHandler;
    if (this.playerHandlerAttached) {
      this.network = network;
      $(document).keyup(this.keyUp.bind(this));
      $(document).mouseup(this.keyUp.bind(this));
      $(document).mousedown(this.keyDown.bind(this));
      $(document).keydown(this.keyDown.bind(this));
    }
    createjs.Ticker.addEventListener('tick', this.tick.bind(this));
  }
  keyDown(e) {
    e.preventDefault();
    if (Keybinds.AutoAttack == e.which){
      this.keysDown[e.which] = [e.clientX, e.clientY];
    } else {
      this.keysDown[e.which] = true;
    }
  }
  keyUp(e) {
    e.preventDefault();
    delete this.keysDown[e.which];
  }
  handleInput(event) {

    // Handle Movement
    let walking = false;
    let speed = event.delta * this.hero.speed;
    if (Keybinds.Up in this.keysDown) {
      this.hero.y -= speed;
      walking = true;
    }
    if (Keybinds.Down in this.keysDown) {
      this.hero.y += speed;
      walking = true;
    }
    if (Keybinds.Left in this.keysDown) {
      this.hero.x -= speed;
      walking = true;
    }
    if (Keybinds.Right in this.keysDown) {
      this.hero.x += speed;
      walking = true;
    }
    if (Keybinds.AutoAttack in this.keysDown) {
      this.hero.autoAttack(this.keysDown[Keybinds.AutoAttack]);
    }
  }
  tick(event){
    this.handleInput(event);
    if (this.playerHandlerAttached) {
      this.network.sendMessage(msgtypes.PLAYER_INPUT, this.keysDown);
    }
  }
  public(){
    return {
      _id : this.publicId,
      keysDown: this.keysDown,
      name: this.name,
      hero :  {
        _heroId : this.hero._heroId,
        x: this.hero.x,
        y: this.hero.y
      }
    };
  }
}

module.exports = Player;

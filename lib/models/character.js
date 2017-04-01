const Zenobia = require('../heroes/zenobia');
const $ = require('jquery');
const Keybinds = require('../keybinds');
const network = require('../network');
const msgtypes = require('../network_message_types.js');
const herotypes = require('../heroes/hero_types');
const uuid = require('uuid');
require('node-easel');

class Character{
  constructor(char, attachPlayerHandler, remote) {
    // create the hero for the character.
    switch(char._heroId) {
        case herotypes.ZENOBIA:
          this.hero = new Zenobia();
          break;
        default:
          break;
    }
    this.publicId = uuid();
    this.name = char.name;
    this.remote = remote;
    this.keysDown = {};
    this.hero.sprite.x = 35;
    this.hero.sprite.y = 30;
    this.playerHandlerAttached = attachPlayerHandler;
    if (this.playerHandlerAttached) {
      $(document).keyup(this.keyUp.bind(this));
      $(document).keydown(this.keyDown.bind(this));
    }
    createjs.Ticker.addEventListener('tick', this.tick.bind(this));
  }
  keyDown(e) {
    e.preventDefault();
    this.keysDown[e.which] = true;
  }
  keyUp(e) {
    e.preventDefault();
    delete this.keysDown[e.which];
  }
  handleInput() {
    // Handle Movement
    let walking = false;
    if (Keybinds.Up in this.keysDown) {
      this.hero.sprite.y -= this.hero.speed;
      walking = true;
    }
    if (Keybinds.Down in this.keysDown) {
      this.hero.sprite.y += this.hero.speed;
      walking = true;
    }
    if (Keybinds.Left in this.keysDown) {
      this.hero.sprite.x -= this.hero.speed;
      walking = true;
    }
    if (Keybinds.Right in this.keysDown) {
      this.hero.sprite.x += this.hero.speed;
      walking = true;
    }
  }
  tick(event){
    this.handleInput();
    if (this.playerHandlerAttached) {
      network.sendMessage(msgtypes.PLAYER_INPUT, this.keysDown);
    }
  }
  public(){
    return {
      _id : this.publicId,
      keysDown: this.keysDown,
      hero : this.hero
    };
  }
}

module.exports = Character;

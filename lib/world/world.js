const Map = require('./map');
const path = require('path');

class World {
  constructor(name, stage) {
    this.map = undefined;
    this.createWorld(name, stage);
  }
  createWorld(name, stage) {
    this.map = new Map(path.resolve(__dirname, `../assets/${name}.json`), stage);
  }
}
module.exports = World;

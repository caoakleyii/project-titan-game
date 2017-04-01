require('node-easel');
const herotypes = require('./hero_types');

class Zenobia {
  constructor() {
    this._heroId = herotypes.ZENOBIA;
    // spawn zenobia
    let graphics = new createjs.Graphics();
    graphics.setStrokeStyle(1);
    graphics.beginStroke("#FFFFFF");
    graphics.beginFill("#42e2f4");
    graphics.drawCircle(0,0,7);

    this.sprite = new createjs.Shape(graphics);
    this.speed = 3;
    this.gravity = true;
    this.solid = true;
  }
}

module.exports = Zenobia;

if (process.env.server) {
  require('node-easel');
}

const Vector2 = require('../core/vector2');
const herotypes = require('./hero_types');
const Gravity = require('../component/gravity');

class Zenobia extends createjs.Shape {
  constructor() {
    // draw faux graphics for zenobia
    let graphics = new createjs.Graphics();
    graphics.setStrokeStyle(1);
    graphics.beginStroke("#FFFFFF");
    graphics.beginFill("#42e2f4");
    graphics.drawCircle(0,0,7);

    super(graphics);

    this._heroId = herotypes.ZENOBIA;
    this.spawnedArrows = [];
    createjs.Ticker.addEventListener('tick', this.tick.bind(this));

    this.speed = 0.2;
    this.gravity = new Gravity();
  }
  autoAttack(position) {
    let target = new Vector2(position);
    let direction = new Vector2([target.x - this.x, target.y - this.y]);
    direction = direction.normalize();

    let graphics = new createjs.Graphics()
    graphics.setStrokeStyle(1);
    graphics.beginStroke("#FFFFFF");
    graphics.beginFill("#ff0000");
    graphics.drawCircle(0,0,2);

    let arrow = new createjs.Shape(graphics);
    
    this.stage.addEntity(arrow);
    arrow.x = this.x;
    arrow.y = this.y;
    arrow.direction = direction;
    this.spawnedArrows.push(arrow);

  }
  tick(event){
    let speed = event.delta * 0.4;
    this.spawnedArrows.forEach(arrow => {
      arrow.x += speed * arrow.direction.x;
      arrow.y += speed * arrow.direction.y;
    })
  }
}

module.exports = Zenobia;

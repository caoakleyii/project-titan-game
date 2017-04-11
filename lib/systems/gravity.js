const SystemKeys = require('./system_keys');
const ndgmr = require('../core/ndgmr');

class Gravity {
  constructor(){
    this.id = SystemKeys.GRAVITY;
    this.entities = [];
  }
  addEntity(entity){
    this.entities.push(entity);
  }
  run(delta) {
    this.entities.forEach(entity => {
      if (entity.gravity.on) {
        let hit;
        entity.stage.children.forEach((x => {
          if (!hit) {
            hit = this.floorCheck(entity, x);
          }
        }).bind(this));
        if(!hit) {
          entity.y += delta * 0.1;
        }
      }
    });
  }
  floorCheck(entity, child){
    if (child == entity || (!child.solid && !child.children)) {
      return;
    }
    let hit;
    if (child.children) {
      child.children.forEach((x => {
        if(!hit) {
          hit = this.floorCheck(entity, x);
        }
      }).bind(this));
    }
    hit = ndgmr.checkRectCollision(entity, child);
    console.log(hit);
    return hit;
  }
}
module.exports = Gravity;

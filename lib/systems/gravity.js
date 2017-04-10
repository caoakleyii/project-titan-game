const SystemKeys = require('./system_keys');

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
      entity.y += delta * 0.1;
    });
  }
}
module.exports = Gravity;

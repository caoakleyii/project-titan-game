if (process.env.server) {
  require('node-easel');
}
const SystemKeys = require('./system_keys');
const GravityComponent = require('../component/gravity');

class Systems {
  constructor(...args) {
    this.systems = [];
    [...args].forEach(system => {
      if (system.run == undefined){
        console.log('Error registering a system, run function was not defined.', system);
        return;
      }
      this.systems[system.id] = system;
    });

    createjs.Ticker.addEventListener('tick', this.tick.bind(this));
  }
  register(system) {
    if (system.run == undefined){
      console.log('Error registering a system, run function was not defined.', system);
      return;
    }
    this.systems[system.id] = system;
  }
  addEntity(entity, system_key) {
    if (!system_key) {
      for (let key in entity) {

        if (entity[key] instanceof GravityComponent) {
          this.systems[SystemKeys.GRAVITY].addEntity(entity);
          continue;
        }

      }
    } else {
      this.systems[system_key].addEntity(entity);
    }
  }
  tick(event){
    this.systems.forEach(system => {
      if (system.run == undefined){
        return;
      }
      system.run(event.delta);
    });
  }

}

module.exports = Systems;

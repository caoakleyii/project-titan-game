const dgram = require('dgram');
const msgpack = require('msgpack5')();
const netmsg = require('../lib/network_message');
const msgtypes = require('../lib/network_message_types.js');

class Network {
  constructor(){
    this.port = 55555;
    this.server = 'localhost';
    this.client = dgram.createSocket('udp4');
    this.playerDisconnect = function() {};
    this.playerConnect = function() {};
    this.playerInput = function() {};
    this.client.on('message', ((msg, rinfo) => {
      msg = msgpack.decode(msg);
      msg = netmsg.unpack(msg);

      switch(msg.type){
        case msgtypes.DISCONNECT:
          this.onPlayerDisconnect(msg);
          break;
        case msgtypes.CONNECT:
          this.onPlayerConnect(msg);
          break;
        case msgtypes.PLAYER_INPUT:
          this.onPlayerInput(msg);
          break;
        default:
          break;
      }

    }).bind(this));
    this.connected = false;
  }
  onPlayerDisconnect(msg) {
    if(!this.onPlayerDisconnectHandler) {
      console.log('No handler attached for player disconnecting.');
    }
    this.onPlayerDisconnectHandler(msg);
  }
  onPlayerConnect(msg) {
    if(!this.onPlayerConnectHandler) {
      console.log('No handler attached for player connecting.');
    }
    this.onPlayerConnectHandler(msg);
  }
  onPlayerInput(msg) {
    if(!this.onPlayerInput) {
      console.log('No handler attached for player input.');
    }
    this.onPlayerInputHandler(msg);
  }
  connect(id) {
    this.id = id;
    this.connected = true;
    this.sendMessage(msgtypes.CONNECT);
  }
  sendMessage(type, data, callback) {
    var msg = {
      id: this.id,
      type: type,
      data: data
    };

    msg = netmsg.pack(msg);
    var compressedMsg = Buffer.from(msgpack.encode(msg));
    this.client.send(compressedMsg, this.port, this.server, callback);
  }
}

module.exports = exports = new Network();

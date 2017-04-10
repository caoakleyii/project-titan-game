const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const msgpack = require('msgpack5')();
const msgtypes = require('../../lib/network_message_types');
const netmsg = require('../../lib/network_message');
const Characters = require('../models/characters');
const Player = require('../../lib/models/player');
const GameEngine = require('./game_engine');
const Vector2 = require('../../lib/core/vector2');

class Server {
  constructor(socket) {
    this.port = 55555;
    this.host =  '127.0.0.1';
    this.socket = socket;
    this.players = [];
    this.gameRooms = [];


    // for now we just have one game room.
    this.gameRooms.push(new GameEngine());


    this.socket.on('listening', (() => {
      console.log(`UDP Server is started and listening on ${this.host}:${this.port}!`);
    }).bind(this));

    this.socket.on('message', ((msg, remote) => {
      msg = msgpack.decode(msg);
      msg = netmsg.unpack(msg);

      switch(msg.type){
        case msgtypes.DISCONNECT:
          this.onPlayerDisconnect(msg);
          break;
        case msgtypes.CONNECT:
          this.onPlayerConnect(msg, remote);
          break;
        case msgtypes.PLAYER_INPUT:
          this.onPlayerInput(msg);
          break;
        default:
          break;
      }
    }).bind(this));
  }

  /**
  * @summary Handles the player disconnecting from the game.
  * @param {object} msg - The network message unpacked.
  */
  onPlayerDisconnect(msg) {
    var player = this.players[msg.id];

    // remove player from the server.
    delete this.players[msg.id];

    // remove the player from the game room.
    this.gameRooms[0].disconnectPlayer(player);
    console.log(`Player disconnected ${player.name}.`);

    // notify everyone in that players game room there was a disconnect.
    for (let _id in this.gameRooms[0].players) {
      if (_id != player._id) {
        let p = this.gameRooms[0].players[_id];
        this.sendMessage(msgtypes.DISCONNECT, player.public(), p.remote);
      }
    }
  }

  /**
  * @summary Adds the players character to the list of characters when he logs in.
  * @param {object} msg - The network message unpacked.
  */
  onPlayerConnect(msg, remote) {
    Characters.findOne({ _id : msg.id }, ((err, dbCharacter) => {
      if (err || !dbCharacter) {
        console.log(`Player could not connect, \n\n Id: ${msg.id} \n\n Error: ${err}`);
        return;
      }

      // create a player object and pass it a character;
      let spawn =  new Vector2([35, 30]);
      let player = new Player(dbCharacter, this.gameRooms[0].stage, spawn, undefined, undefined);
      player._id = msg.id;
      player.remote = remote;

      // add user to server.
      this.players[msg.id] = player;

      // add user to the only current public game room
      this.gameRooms[0].connectPlayer(player);

      console.log(`Player connected ${player.name}.`);

      // notify everyone in that gameroom that a new player connected.
      // send everyone already in the room to that new player.
      for(let _id in this.gameRooms[0].players) {
        if (_id != player._id) {
          let p = this.gameRooms[0].players[_id];
          this.sendMessage(msgtypes.CONNECT, player.public(), p.remote);
          this.sendMessage(msgtypes.CONNECT, p.public(), player.remote);
        }
      }

    }).bind(this));
  }

  /**
  * @summary - Handles the input for the character.
  * @param {object} msg - The network message unpacked.
  */
  onPlayerInput(msg) {
    let player = this.players[msg.id];

    if (!player) {
      return;
    }

    player.keysDown = msg.data;

    // notify everyone in the gameroom of the inputs
    for (let _id in this.gameRooms[0].players) {
      if (_id != player._id) {
        let p = this.gameRooms[0].players[_id];
        this.sendMessage(msgtypes.PLAYER_INPUT, player.public(), p.remote);
      }
    }
  }

  /**
  * @summary - Packs, Encodes and Sends a mesage to a client
  * @param {network_msg_type} Type - The Type of message
  * @param {object} Data           - The Data for the message
  * @param {remote} Client         - The client to receive the message
  * @param {function} Callback     - Callback function when the message is sent.
  */
  sendMessage(type, data, client, callback) {
    let msg = {
      id: 0,
      type: type,
      data: data
    };

    msg = netmsg.pack(msg);
    msg = msgpack.encode(msg);

    let compressedMsg = Buffer.from(msg);
    this.socket.send(compressedMsg, 0, compressedMsg.length, client.port, client.address, callback);
  }

  /**
  * @summary - Starts the UDP Network Server and the Game Engine.
  */
  start() {
    this.socket.bind(this.port, this.host);
    console.log(`Starting UDP Server on ${this.host}:${this.port}...`);

    let tickrate = 29;
    this.gameRooms[0].start(tickrate);
    console.log(`Game engine started at a ${tickrate}hz tickrate`);
  }
}


module.exports = exports = new Server(socket);

const msgtypes = require('./network_message_types');
const msgindexes = require('./network_message_index');
let netmsg = exports;

netmsg.pack = function(msg){
  var packed = {
    [msgindexes.PlayerId]: msg.id,
    [msgindexes.MessageType]: msg.type,
    [msgindexes.Data]: msg.data
  };
  return packed;
}

netmsg.unpack = function(packed){
  var msg = {
    id : packed[msgindexes.PlayerId],
    type: packed[msgindexes.MessageType],
    data: packed[msgindexes.Data]
  };
  return msg;
}

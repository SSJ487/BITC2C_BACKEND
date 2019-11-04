const SocketIO = require('socket.io');

module.exports =(server) =>{
    const io = SocketIO(server,{path:'/socket.io'})
}
var socket = require('socket.io')
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom  ={};

// 启动socket服务器
exports.listen = function(server){
	io = socket.listen(server);
	io.set('log level',1)

	io.socket.on('connection',function(socket){
		guestNumber = assignGuestName(socket,guestNumber,nickNames,namesUsed);

		joinRoon(socket,'Lobby');  //用户连接时，进入Lobby房间

		handleMessageBroadcasting(socket,nickNames)
		handleNameChangeAttempts(socket,nickNames,namesUsed)
		handleRoomJoining(socket)

		socket.on('rooms',function(){
			socket.emit('rooms',io.socket.manager.rooms);
		});

		handleClientDisconnection(socket,nickNames,namesUsed)
	})
}
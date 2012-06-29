/*
 * Created By:Lightnet
 * 
 * src link:https://bitbucket.org/Lightnet/node_crafty
 *
*/

var fs = require('fs');
var nodecrafty = require('./craftymanage');//custom crafty
var craftyclients = [];//user client holder and init stand alone game
var io;
var maps = [];
var gamemanagement;

function InitMap(){
	//console.log("init map...");
	gamemanagement = new nodecrafty.GameManagement();
}

var countid = 0;
var set = function (_io){
	io = _io;

	InitMap();
	
	io.sockets.on('connection', function(client) {
		countid++;
		console.log("client connected!");
		console.log("client id:"+client.id);
		//init game client to hold their variables

		client.emit('id',{id:client.id});//set client id //deal camera set
		io.sockets.emit('chat',{message:'User join channel...'});//set client id //deal camera set
		
		if(gamemanagement !=null){
			gamemanagement.spawnuser(io,client);
		}
		//=======================================
		//chat area
		//=======================================
		client.on('message', function(data){//nothing here
			console.log("DATA SERVER:"+data);
		});
		
		client.on('chat', function(data){//nothing here
			console.log("DATA SERVER:"+data);
			//io.sockets.emit('chat',{message:data['message']});
			ChatFilter(data['message'],io,client);
		});
		//=======================================
		//user client disconnected
		//=======================================
		client.on('disconnect', function(){
			console.log("disconnect");
			//send to other clients on disconnected
			if(gamemanagement !=null){
				gamemanagement.userdisconnect(client.id);
			}
		});
		
		client.on('user', function(data){
			if(data['msg'] == 'userclose'){
				console.log('dc here by user');
			}
		});
	});
}

exports.set = set;

//filter out:
//-scripts
//-commands
//-
function ChatFilter(_txt,io,client){
	//console.log(_txt.indexOf('/'));
	if(_txt.indexOf('<script>') > -1){
		console.log("found script >.>");
		io.sockets.emit('chat',{message:'error!'});
	}else if(_txt.indexOf('/') == 0){
		console.log("found command");
		client.emit('chat',{message:'command!'});
	}else{
		io.sockets.emit('chat',{message:_txt});
	}
}
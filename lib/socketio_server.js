/*
 * Created By:Lightnet
 * 
 * src link:https://bitbucket.org/Lightnet/node_crafty
 * Test area and code build for crafty function and others.
 *
 * This is for client handle socket.io and game handle and engine that init here.
 * The game handle and socket does have event triggers for passing to server to clients.
 * There are couple different method or the same methods that depend on how it is coded.
 *
 * server commands and client commands will have some different in them.
 * - for chats
 * - players
 * - GMs
 * - Admins
 * - Mod
 *
*/

var fs = require('fs');
var craftymanage = require('./craftymanage');//custom crafty

var craftyclients = [];//user client holder and init stand alone game
var io;
var maps = [];
var gamemanagement;
//console.log(craftymanage);
function InitMap(){
	
	gamemanagement.init();	
}

var countid = 0;
var set = function (_io){
	var bmodulesloaded = false;
	var bserversloaded = false;
	var bclientsloaded = false;
	io = _io;
	gamemanagement = new craftymanage.GameManagement();
	gamemanagement.setio(io);
	InitMap();
	
	
	craftymanage.controller.on('loaded',function(data){
		console.log("loading..."+data);
		if(data == 'craftyjsmodules'){
			bmodulesloaded = true;
		}
		if(data == 'craftyjsserver'){
			bserversloaded = true;
		}
		if(data == 'craftyclient'){
			bclientsloaded = true;
		}
		if((bmodulesloaded == true)&&(bserversloaded == true)&&(bclientsloaded == true)){
			console.log('fully loaded...');
			//console.log(craftymanage);
			gamemanagement.initprefabs();
			
			
			io.sockets.on('connection', function(client) {
				countid++;
				console.log("client connected!");
				console.log("client id:"+client.id);
				//init game client to hold their variables

				client.emit('id',{id:client.id});//set client id //deal camera set
				io.sockets.emit('chat',{message:'User join channel...'});//set client id //deal camera set
				///=======================================
				//client handler
				//=======================================
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
					//console.log("DATA SERVER:"+data);
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
		//console.log("found command");
		//client.emit('chat',{message:'command!'});
		cmdfilter(_txt,io,client);
	}else{
		io.sockets.emit('chat',{message:_txt});
	}
}
cmdfilter = function(_strtext,io,client){
		var cmds = _strtext.split(" ");
		console.log(cmds);
		/*
		if(cmds[0] == '/help'){
			client.emit('chat',{message:'/report'});
			client.emit('chat',{message:'/map'});
			client.emit('chat',{message:'/inventory'});
			client.emit('chat',{message:'/pet'});
			client.emit('chat',{message:'/createroom'});
			client.emit('chat',{message:'/createguild'});
			client.emit('chat',{message:'/gjoin'});
			client.emit('chat',{message:'/gkick'});
			client.emit('chat',{message:'/gleader'});
			client.emit('chat',{message:'/gmsg'});
			client.emit('chat',{message:'/gaccept'});
			client.emit('chat',{message:'/gleave'});
			client.emit('chat',{message:'/cparty'});
			client.emit('chat',{message:'/pkick'});
			client.emit('chat',{message:'/padd'});
			client.emit('chat',{message:'/pleader'});
			client.emit('chat',{message:'/pleave'});
			client.emit('chat',{message:'/pshare'});
			client.emit('chat',{message:'/ptake'});
			client.emit('chat',{message:'/kick'});
			client.emit('chat',{message:'/ban'});
			client.emit('chat',{message:'/jail'});
			client.emit('chat',{message:'/t'});
			client.emit('chat',{message:'/home'});
			client.emit('chat',{message:'/le'});
			client.emit('chat',{message:'/cwall'});
			client.emit('chat',{message:'/report'});
			
		}
		if(cmds[0] == '/cs'){
			//client.emit('chat',{message:''});
			console.log(Crafty.support);
		}

		if(cmds[0] == '/report'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/map'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/inventory'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/pet'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/createroom'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/createguild'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/gjoin'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/gkick'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/gleader'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/gmsg'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/gaccept'){
			client.emit('chat',{message:''});
		}
		if(cmds[0] == '/gleave'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/cparty'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/pkick'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/padd'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/pleader'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/pleave'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/pshare'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/ptake'){
			client.emit('chat',{message:''});
		}
		
		
		if(cmds[0] == '/kick'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/ban'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/jail'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/t'){
			client.emit('chat',{message:''});
		}
		
		if(cmds[0] == '/home'){
			client.emit('chat',{message:''});
		}
		
		
		if(cmds[0] == '/crafty'){
			console.log(Crafty);
		}
		
		if(cmds[0] == '/le'){
			var entilies = Crafty.debug();
			console.log("LEN:"+entilies.length);
			for ( i in entilies){
				console.log(entilies[i].id);
				console.log(entilies[i].objname);
				client.emit('chat',{message:entilies[i].id+" : "+entilies[i].objname});
				//console.log(entilies[i]);
			}
		}
		
		if(cmds[0] == '/cwall'){
			console.log(Crafty);
			var entily = Crafty.e('Wall');
			client.emit('chat',{message:entily.id+" : "+entily.objname});
		}
		*/

}
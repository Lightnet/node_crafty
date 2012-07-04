/*
 * Created By:Lightnet
 * 
 * src link:https://bitbucket.org/Lightnet/node_crafty
 *
 * Credits: Craftyjs
 * 
 * Information: This section deal with loading by using eval function
 * to deal with components add into the crafty as well custom components.
 * without need of using much of loading the modules in few case here.
 * There are few change how crafty work in nodejs.
 *
 * After some testing eval() funciton will not work with in other function.
 * It has be outside to get function global to used it.
 * It will required wait until it loaded right.
 *
 * Client commands:
 *
*/

var fs = require('fs');
var util = require("util");
var events = require('events');
var EventEmitter = require( "events" ).EventEmitter;
var controller = new EventEmitter();
//load this first so it start to create functions, classes and components.
var filedata = fs.readFileSync(__dirname+'/craftynode.js','utf8');  //main crafty structures.
eval(filedata);

//load default core of the engine
//naming the files are important it load in orders.
fs.readdir(__dirname+'\\craftyjsmodules', function(err1, files){
	if(files){
		getExt = function (path) {
			var i = path.lastIndexOf('.');
			return (i < 0) ? '' : path.substr(i);
		}
		//console.log("[loading core files]"+files.length);
		var countfile = 0;
		function printBr(element, index, array) {
			if(getExt(element) == '.js'){
				//console.log("loading file:"+element);
				filedata = fs.readFileSync(__dirname+'\\craftyjsmodules\\'+element,'utf8'); // default crafty format not yet added.
				eval(filedata);
				//if(Crafty !=null){console.log(Crafty);};
				countfile++;
		   }
		}
		files.forEach(printBr);
		controller.emit( "loaded", "craftyjsmodules" );
		console.log("finish loading server..."+countfile);

	}
});
	
//console.log("loading server...");
//load custom script to run on server private access
fs.readdir(__dirname+'\\craftyjsserver', function(err1, files){
	if(files){
		getExt = function (path) {
			var i = path.lastIndexOf('.');
			return (i < 0) ? '' : path.substr(i);
		}
		//console.log("[loading server files]"+files.length);
		var countfile = 0;
		function printBr(element, index, array) {
			if(getExt(element) == '.js'){
				//console.log("loading file:"+element);
				filedata = fs.readFileSync(__dirname+'\\craftyjsserver\\'+element,'utf8'); // default crafty format not yet added.
				eval(filedata);
				//if(Crafty !=null){console.log(Crafty);};
				countfile++;
		   }
		}
		files.forEach(printBr);
		controller.emit( "loaded", "craftyjsserver" );
		console.log("finish loading server..."+countfile);
	}
});
	
//console.log("loading client...");
//load custom script on client and open to the public
fs.readdir(__dirname+'\\craftyclient', function(err1, files){
	if(files){
		getExt = function (path) {
			var i = path.lastIndexOf('.');
			return (i < 0) ? '' : path.substr(i);
		}
		//console.log("[loading client files and write]"+files.length);
		var stream = fs.createWriteStream(__dirname+"/../public/"+"lib.js");
		var countfile= 0;
		stream.once('open', function(fd) {
			function printBr(element, index, array) {
				if(getExt(element) == '.js'){
					filedata = fs.readFileSync(__dirname+'\\craftyclient\\'+element,'utf8'); // default crafty format not yet added.
					stream.write("\n")
					stream.write(filedata);
					countfile++;
				}
			}
			files.forEach(printBr);
			controller.emit( "loaded", "craftyclient" );
			console.log("finish write client..."+countfile);
		});
	}
});

var GameManagement = function(){
	this.players = [];
	this.npcs = [];
	this.objects = [];
	this.projectiles = [];
	this.io;
	//this.bprefabbuild = true;
	
	this.initprefabs = function(){
    	this.initnpcs();
		this.initobjects();
		//this.bprefabbuild = false;
	}
	
	this.setio = function(_io){
		this.io = _io;
	}
	
	this.init=function(){
		console.log('run game/engine...');
		Crafty.run();
	}
	
	this.initnpcs = function(){
		var npc = Crafty.e('en_npc');
		npc.serverid = 'npc01';
		//console.log(npc);
		this.npcs.push(npc);
	}
	
	this.sendnpcs= function(){
		//console.log('sending objects...'+ this.npcs.length);
		var npcs = this.npcs;
		for (i in npcs){
			//console.log(npcs[i]);
			//console.log('sented object...');
			this.io.sockets.emit('char',{
			action:"pos",
			objid:npcs[i].objid,
			serverid:npcs[i].serverid,
			x:npcs[i].x,
			y:npcs[i].y,
			z:1
			});
		}
	}
	
	this.initobjects = function(){
		var eobj = Crafty.e('Wall');
		eobj.serverid = 'wall01';
		//console.log(eobj);
		this.objects.push(eobj);
	}
		
	this.sendobjects= function(){
		//console.log('sending objects...'+ this.objects.length);
		var objects = this.objects;
		for (i in objects){
			//console.log('sented object...');
			this.io.sockets.emit('eobj',{
			action : "pos",
			objid : objects[i].objid,
			serverid:objects[i].serverid,
			x:objects[i].x,
			y:objects[i].y,
			z:1
			});
		}
	}
	
	
	
	//when user enter the server do that following.
	this.spawnuser = function (io,client){
        //if(this.bprefabbuild){
            //this.initprefabs();
		//}

		var self = this;
		client.on('chat', function(data){//nothing here
			//console.log("DATA SERVER:"+data);
			self.chatcmd(data['message'],io,client);
		});
		var player = Crafty.e('player');
		player.id = client.id;
		player.initsockets(client);
		player.io = io;

		this.players.push(player);
		io.sockets.emit('position',{id:client.id,x:0,y:0,z:0});//init or spawn player
		this.sendnpcs();
		this.sendobjects();
		for (i in this.players){
			if(this.players[i].id != client.id){
				client.emit('position',{id:this.players[i].id,x:this.players[i].__pos.x,y:this.players[i].__pos.y,z:0});
			}
		}
	}
	
	//when user disconnect or close on brower.
	this.userdisconnect = function (_id){
		
		for (i in this.players){
			if(this.players[i].id == _id){
                var tmplayer = this.players[i];
				this.players[i].dc();//send msg to clients d/c
				this.players[i].destroy();
				this.players.splice(i,1);//remove client
				delete tmplayer;
				//console.log(tmplayer);
				break;
			}
		}		
	}
	
	this.chatcmd = function (_txt,io,client){
		//console.log(_txt.indexOf('/'));
		if(_txt.indexOf('<script>') > -1){
			console.log("found script >.>");
			//io.sockets.emit('chat',{message:'error!'});
		}else if(_txt.indexOf('/') == 0){
			this.cmdfilter(_txt,io,client);
		}else{
		
		}
	}

	this.cmdfilter = function(_strtext,io,client){
		var cmds = _strtext.split(" ");
		console.log(cmds);
		
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
	}
	return this;
};

module.exports.GameManagement = GameManagement;
util.inherits(GameManagement, events.EventEmitter);

module.exports.controller = controller;
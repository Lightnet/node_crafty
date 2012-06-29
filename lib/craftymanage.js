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
 *
*/

var fs = require('fs');

//load the engine //deal with chnage on the fly
var filedata = fs.readFileSync(__dirname+'/craftynode.js','utf8');  //main crafty structures.
eval(filedata);
filedata = fs.readFileSync(__dirname+'/craftymodel.js','utf8'); // default crafty format not yet added.
eval(filedata);
filedata = fs.readFileSync(__dirname+'/craftymodelcustom.js','utf8'); //user custom crafty that is still in testing stage.
eval(filedata);


Crafty.run();                                    //start game here
console.log('init. timer and frame trigger...');


console.log(Crafty.support.setter);

var GameManagement = function(){
	this.id = 0;
	this.interval = 33;
	this.bstop = false;
	this.players = [];
	/*
	this.enterframe = function (){
		this.emit('EnterFrame');
		this.id++;
	};

	this.run=function(){
		var self = this;
		this.enterframe();
		if(this.bstop === false){
			setTimeout(function(){self.run();},this.interval);
		}else{
			return;
		}
	};
	
	this.stop = function(){
		this.bstop = true;
		var self = this;
		clearTimeout(function(){self.run();});
	};
	*/
	
	this.spawnuser = function (io,client){
		var player = Crafty.e('player');
		player.id = client.id;
		player.initsockets(client);
		player.io = io;

		this.players.push(player);
		io.sockets.emit('position',{id:client.id,x:0,y:0,z:0});//init or spawn player
		
		for (i in this.players){
			if(this.players[i].id != client.id){
				client.emit('position',{id:this.players[i].id,x:this.players[i].__pos.x,y:this.players[i].__pos.y,z:0});
			}
		}
	}
	
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
	
	return this;
};


Crafty.circle = function (x, y, radius) {
	this.x = x;
	this.y = y;
	this.radius = radius;

	// Creates an octogon that aproximate the circle for backward compatibility.
	this.points = [];
	var theta;

	for (var i = 0; i < 8; i++) {
		theta = i * Math.PI / 4;
		this.points[i] = [Math.sin(theta) * radius, Math.cos(theta) * radius];
	}
};

Crafty.circle.prototype = {
	containsPoint: function (x, y) {
		var radius = this.radius,
		    sqrt = Math.sqrt,
		    deltaX = this.x - x,
		    deltaY = this.y - y;

		return (deltaX * deltaX + deltaY * deltaY) < (radius * radius);
	},

	shift: function (x, y) {
		this.x += x;
		this.y += y;

		var i = 0, l = this.points.length, current;
		for (; i < l; i++) {
			current = this.points[i];
			current[0] += x;
			current[1] += y;
		}
	},

	rotate: function () {
		// We are a circle, we don't have to rotate :)
	}
};



Crafty.matrix = function (m) {
	this.mtx = m;
	this.width = m[0].length;
	this.height = m.length;
};

Crafty.matrix.prototype = {
	x: function (other) {
		if (this.width != other.height) {
			return;
		}

		var result = [];
		for (var i = 0; i < this.height; i++) {
			result[i] = [];
			for (var j = 0; j < other.width; j++) {
				var sum = 0;
				for (var k = 0; k < this.width; k++) {
					sum += this.mtx[i][k] * other.mtx[k][j];
				}
				result[i][j] = sum;
			}
		}
		return new Crafty.matrix(result);
	},


	e: function (row, col) {
		//test if out of bounds
		if (row < 1 || row > this.mtx.length || col < 1 || col > this.mtx[0].length) return null;
		return this.mtx[row - 1][col - 1];
	}
}

module.exports.GameManagement = GameManagement;
util.inherits(GameManagement, events.EventEmitter);

//console.log('end crafty manage');

//console.log(craftymodel());
//console.log(Vector2D);
//console.log(Crafty.debug()); //enity
//console.log(Crafty.components()); //enity


//var bl = Crafty.e('bl');
//console.log(bl);

//console.log(Crafty.map);

var wall = Crafty.e("Wall");
wall.x = -32;
wall.y = 0;

//var player = Crafty.e('player');
//player.addComponent('bl');



//console.log(player);
//player = Crafty.e('player');
//console.log(player);
//console.log(Crafty().debug()); //enity
//console.log(Crafty.components()); //enity
//console.log('Crafty Manage Section');
//var imagepath = "";

//imagepath = "./";
//imagepath = "/image/";
var npcmenu = null;

var characters = [];
var players = [];
var npcs = [];
var monsters = [];
var spawnpoints= [];
var currentchartag = "";
var __id = 0;

window.onload = (function() {
    var WIDTH = 640,
        HEIGHT = 480;
        
    Crafty.init(WIDTH, HEIGHT);
	Crafty.background("#f0f0f0");
	
	Crafty.sprite(32,48, imagepath+ "tokinoiori08.png", {
		player: [0,0],
		//player: [0,3]
	});
	
	Crafty.sprite(32, imagepath+ "char2d_editor.png", {
		spawnmonsterpic: [0,0],
		spawnbosspic:[2,0],
		monsterpic: [1,0],
		spawnplayerpic: [0,2],
		spawnteampic: [1,2]
	});
	
	Crafty.sprite(32, imagepath+ "ship5crsdarius.png", {
		nship: [0,0]
	});
	
	Crafty.sprite(16,16, imagepath+ "bullet.png", {
		nbullet: [0,0]
	});
	
	Crafty.c('Shipinfo', {
		Shipinfo: function() {
			this.userid = '';
			this.usertag = '';
			this.health = 1000;
			this.healthmax = 1000;
			this.shield = 1000;
			this.shieldmax = 1000;
			
			return this;
		}
	});
	
	Crafty.c("TestRotate", {
		_maxwidth:32,
		_maxheight:32,
		init: function() {
			this.addComponent("2D, DOM, Color");
			this.w = 32;    // width
			this.h = 32;    // height
			this.color("#969600");
			this.attr({x: 256, y: 256, z: 1});//position and visible layer
			this.origin("center");//center the sprite image
			this.bind('EnterFrame', function() {
				this.rotation += 1;
				//console.log(this.rotation);
			});
		}
	});	
	
	Crafty.c("Wall", {
		_maxwidth:32,
		_maxheight:32,
		init: function() {
			this.addComponent("2D, DOM, Color");
			this.addComponent("2D");
			this.w = 32;    // width
			this.h = 32;    // height
			this.color("#969600");
			this.attr({x: 256, y: 256, z: 1});//position and visible layer
			this.origin("center");//center the sprite image
			this.bind('EnterFrame', function() {
				//this.rotation += 1;
				//console.log(this.rotation);
			});
		}
	});	
	
	
	//monster attack player
	Crafty.c("MAttack", {
		_maxwidth:32,
		_maxheight:32,
		_timecount:0,
		_timecountmax:1,
		init: function() {
			this.addComponent("2D, DOM, Color, Collision, CharacterInfo");
			this.CharacterInfo();
			this.w = 32;    // width
			this.h = 32;    // height
			this.color("#969600");
			this.attr({x: 0, y: 0, z: 1});//position and visible layer
			this.bind('EnterFrame', function() {
				if(this._timecount > this._timecountmax ){//this will some what delay the frame before delete.
					this.destroy();	
				}
			});
			this.onHit("EnPlayer", function(targets) {
				for (i in targets){
					console.log(targets[i].obj.charname);
					console.log(targets[i].obj.health);
					if(targets[i].obj.defence < this.attack){
						targets[i].obj.health += (targets[i].obj.defence - this.attack);
					}
				}
				this.destroy();
			});
		}
	});	
	//player attack monster
	Crafty.c("PAttack", {
		_maxwidth:32,
		_maxheight:32,
		_timecount:0,
		_timecountmax:1,
		init: function() {
			this.addComponent("2D, DOM, Color, Collision, CharacterInfo");
			this.CharacterInfo();
			this.w = 32;    // width
			this.h = 32;    // height
			this.color("#969600");
			this.attr({x: 0, y: 0, z: 1});//position and visible layer
			this.bind('EnterFrame', function() {
				//console.log("player attack");
				this._timecount++;
				if(this._timecount > this._timecountmax ){//this will some what delay the frame before delete.
					this.destroy();	
				}
				//this.destroy();			
			});
			
			this.onHit("EnMonster", function(targets) {
				for (i in targets){
					console.log(targets[i].obj.charname);
					console.log(targets[i].obj.health);
					if(targets[i].obj.defence < this.attack){
						targets[i].obj.health += (targets[i].obj.defence - this.attack);
					}
				}
				this.destroy();
			});
		}
	});	
	
	Crafty.c("PInteractNPC", {
		_maxwidth:32,
		_maxheight:32,
		_timecount:0,
		_timecountmax:1,
		init: function() {
			this.addComponent("2D, DOM, Color, Collision");
			this.w = 32;    // width
			this.h = 32;    // height
			this.color("#969600");
			this.attr({x: 0, y: 0, z: 1});//position and visible layer
			this.bind('EnterFrame', function() {
				//console.log("player attack");
				this._timecount++;
				if(this._timecount > this._timecountmax ){//this will some what delay the frame before delete.
					this.destroy();	
				}
				//this.destroy();			
			});
			
			this.onHit("EnNPC", function(targets) {
				for (i in targets){
					console.log(targets[i].obj.charname);
					console.log(targets[i].obj.health);
					if(npcmenu !=null){
						console.log("NULL:"+targets[i].obj.charname);
						npcmenu._charinfo = targets[i].obj;
						npcmenu.showmenu();
					}else{
						npcmenu = Crafty.e("NPCMenu");
						npcmenu._charinfo = targets[i].obj;
						npcmenu.showmenu();
						console.log("NULL:"+targets[i].obj.charname);
					}
					break;
				}
				this.destroy();
			});
		}
	});	
	
	Crafty.c("ProgressBarBG", {
		_id: 0,
		_speed: 3,
		_maxwidth:30,
		_maxheight:12,
		init: function() {
			this.addComponent("2D, DOM, Color");
			this.w = 32;    // width
			this.h = this._maxheight;    // height
			this.color("#969696");
			this.attr({x: 0, y: 0, z: 1});//position and visible layer
		}
	});	
	
	Crafty.c("ProgressBar", {
		_id: 0,
		_speed: 3,
		_maxwidth:30,
		_maxheight:12,
		_bg_bar:null,
		_percent:0,
		init: function() {
			this.addComponent("2D, DOM, Color");
			this._bg_bar = Crafty.e("ProgressBarBG");
			this.w = 32;    // width
			this.h = this._maxheight;    // height
			this.color("#008000");
			console.log("init box");
			this.attr({x: 0, y: 0, z: 2});//position and visible layer
			
			this.bind('EnterFrame', function() {
				this._bg_bar.x = this.x
				this._bg_bar.y = this.y
				/*
				this._percent += 0.01;
				this.percent(this._percent);
				if(this._percent > 1){
					this._percent = 0;
				}
				*/
			});
		},
		percent:function (_percent){
			if(_percent !=null){
				if(_percent > 1){
					_percent = 1;
				}
				if(_percent < 0){
					_percent;
				}
				this.w = (this._maxwidth * _percent);			
			}
		},
		endelete:function(){
			this._bg_bar.destroy();
			this._bg_bar = null;
		}
		
	});	
	
	
	/*
		monsterspawner
	*/
	Crafty.c("MonsterEmitter", {		
		_id: 0,
		//_currentmonster = null,
		_spawntime:0,
		_spawntimecap:10,
		_bspawn:false,
		init: function() {
			
			this.addComponent("2D, DOM, Color, spawnmonsterpic");
			this.w = 32;    // width
			this.h = 32;    // height
			this.color("#008000");
			//console.log("init box");
			this.attr({x: 0, y: 0, z: 2});//position and visible layer
			
			this.bind('EnterFrame', function() {
				if(this._currentmonster == null){
					this._spawntime++;
					if(this._spawntime >  this._spawntimecap){
						this._currentmonster = Crafty.e("EnMonster");
						this._currentmonster.x = this.x;
						this._currentmonster.y = this.y;
						this._spawntime = 0;
						console.log("monster spawn:"+this._spawntime);
					}
					console.log("monster time:"+this._spawntime);
				}else{
					if(this._currentmonster.health < 0){
						this._currentmonster.endelete();
						this._currentmonster = null;
					}
				}
			});
		}
	});
	
	Crafty.c("CharacterSpawnPoint", {
		_id: 0,
		_spawntime:0,
		_spawntimecap:5,
		_bspawn:false,
		init: function() {
			spawnpoints.push(this);
			this.addComponent("2D, DOM, Color, spawnplayerpic");
			this.w = 32;    // width
			this.h = 32;    // height
			this.color("#008000");
			//console.log("init box");
			this.attr({z: 2});// visible layer
			this.bind('EnterFrame', function() {
				
			});
		},
	});	
	
	
	Crafty.c("Ship", {
		_id: 0,
		teamid:0,
		__move: {left: false, right: false, up: false, down: false},
		action:"",
		_dir:{x:0,y:0},
		_speed: 3,
		_healthbar:null,
		_displayname:null,
		degreeInRadians : 2*Math.PI/360,
		angle : 0,
		init: function() {
			
			__id++;
			this._id = __id;
			characters.push(this);
			console.log("init player");
			//console.log(this);
			var move = this.__move;
			this._healthbar = Crafty.e("ProgressBar");
            this.addComponent("2D, DOM, SpriteAnimation, nship, Collision");

			this.attr({x: 0, y: 0, z: 3});//position and visible layer
			this.origin("center");//center the sprite image
			this.bind('EnterFrame', function() {
				
				if(currentchartag == this._id){
					Crafty.viewport.x = ((this.x - 256) * -1);//camera view port and off set
					Crafty.viewport.y = ((this.y - 256 ) * -1);//camera view port and off set
				
					if (move.right){ 
					this.rotation += this._speed;
					}
					else if (move.left){ 
						this.rotation -= this._speed;
						//console.log(this.rotation);
					}
					if (move.up){ 
						this.moveforward (this.rotation);
					}
					else if (move.down){ 
					
					}
				}
			});
			
			this.moveforward = function(angle){
				//console.log();
				var realX = this.x;
				var realY = this.y;
				realX = realX + Math.cos(this.degreeInRadians * angle);
				realY = realY + Math.sin(this.degreeInRadians * angle);
				this.x = realX;
				this.y = realY;
				
			};
			
			this.bind('KeyDown', function(e){
				//console.log(Crafty.keys);
				// If keys are down, set the direction
				if(currentchartag == this._id){
					if (e.keyCode === Crafty.keys.RIGHT_ARROW){ move.right = true;}
					if (e.keyCode === Crafty.keys.LEFT_ARROW){ move.left = true;}
					if (e.keyCode === Crafty.keys.UP_ARROW){ move.up = true;}
					if (e.keyCode === Crafty.keys.DOWN_ARROW){ move.down = true;}
					if (e.keyCode === Crafty.keys.E){ 
						console.log("E D");
					}
					
					if (e.keyCode === Crafty.keys.F){ 
						console.log("F D");
					}
				}
				//this.preventTypeaheadFind(e);
			});
			this.bind('KeyUp', function(e) {
				//console.log('key up');
				if(currentchartag == this._id){
					// If key is released, stop moving
					if (e.keyCode === Crafty.keys.RIGHT_ARROW){ move.right = false;

					}
					if (e.keyCode === Crafty.keys.LEFT_ARROW){ move.left = false;}
					if (e.keyCode === Crafty.keys.UP_ARROW){ move.up = false;}
					if (e.keyCode === Crafty.keys.DOWN_ARROW){ move.down = false;}
					if (e.keyCode === Crafty.keys.E){
						console.log("E U");
					}
					
					if (e.keyCode === Crafty.keys.F){
						console.log("F U");
						var bullet = Crafty.e("Bullet");
						bullet.rotation =  this.rotation;
						bullet.teamid = this.teamid;
						bullet.x = this.x;
						bullet.y = this.y;
					}
				}
				//this.preventTypeaheadFind(e);
			});
			this.onHit("Wall", function(targets) {
				console.log('hit wall');
			});
		}
	});	
	
	
	Crafty.c("Bullet", {
		_maxwidth:32,
		_maxheight:32,
		degreeInRadians : 2*Math.PI/360,
		teamid:0,
		_speed:5,
		init: function() {
			this.addComponent("2D, nbullet, DOM, Collision");
			this.w = 8;    // width
			this.h = 8;    // height
			this.origin("center");//center the sprite image
			this.bind('EnterFrame', function() {
				this.moveforward(this.rotation);
			});
			
			this.moveforward = function(angle){
				//console.log();
				var realX = this.x;
				var realY = this.y;
				realX = realX + Math.cos(this.degreeInRadians * angle) * this._speed;
				realY = realY + Math.sin(this.degreeInRadians * angle) * this._speed;
				this.x = realX;
				this.y = realY;
				
			};
			
			this.onHit("Ship", function(targets) {
				for (i in targets){
					console.log(targets[i].obj.teamid);
					if(this.teamid != targets[i].obj.teamid){
						this.destroy();
					}
				}
			});
		}
	});	
	
	Crafty.c("ClickBox", {
		init: function() {
			this.addComponent("2D, DOM, Color, Mouse");
			this.w = 32;    // width
			this.h = 32;    // height
			this.color("#969696");
			console.log("init box");
			//this.attr({x: 160, y: 144, z: 1});//position and visible layer
			this.bind('EnterFrame', function() {
				
			});
			this.bind("Click", function(obj) {
				console.log("Click x:" + obj.realX +" y:" + obj.realY);
            });
		}
	});
	
	Crafty.scene("normalbgcolor", function() {
        //black background with some loading text
        Crafty.background("#f0f0f0");
    });
	
	//the disconnect screen that will display while our assets load
    Crafty.scene("disconnect", function() {
        //black background with some loading text
        Crafty.background("#fff");
        Crafty.e("2D, DOM, Text")
                .attr({w: 100, h: 20, x: 150, y: 120})
            .text("Status: Server disconnect!")
            .css({"text-align": "center" , "color": "#f00"});
    });

	
	Crafty.c("NPCMenu", {
		_maxwidth:640,
		_maxheight:128,
		_charquests:{},
		_charshop:{},
		_displayname:null,
		_displaymessage:null,
		_talkbtn:null,
		_charinfo:null,
		_talktag:"default",
		_count:0,
		talk:function(){
			for (i in this._charinfo._Messages){
				if(this._charinfo._Messages[i].msgtype == this._talktag){
					this._displaymessage.text( "Message:"+this._charinfo._Messages[i].msgtext);
					console.log("MESSAGE:"+this._charinfo._Messages[i].msgtext);
					this._count++;
					console.log(this._count);
					if(this._count > 1){
						this.hidemenu();
					}
					break;
				}
			}
			console.log(this._charinfo);
			console.log(this._charinfo._Messages);
			console.log("END MESSAGE:"+this._charinfo._Messages.length);
		},
		init: function() {
			var self = this;
			this.addComponent("2D, DOM, Color");
			this._displayname = Crafty.e("2D, DOM, Text")
				.textFont({ family: 'Courier New' })
				.textFont({ size: '12px', weight: 'bold' })
				.attr({w:200,   z:7 })
				.text( "NPC:");				
			this._displaymessage = Crafty.e("2D, DOM, Text")
				.textFont({ family: 'Courier New' })
				.textFont({ size: '12px', weight: 'bold' })
				.attr({w:630,h:128,   z:7 })
				.text( "Message:");
			this._talkbtn = Crafty.e("2D, DOM, Text, Color, Mouse")
				.textFont({ family: 'Courier New' })
				.color("#9696FF")
				.textFont({ size: '12px', weight: 'bold' })
				.attr({w:64,h:16,z:7 })
				.text("Talk")
				//.origin("center")
				.bind('Click', function(data) {
					console.log("talk click");
					console.log(this);
					self.talk();
				});
				
				//.textFont({ size: '20px'});
			this.w = this._maxwidth;    // width
			this.h = this._maxheight;    // height
			this.color("#969600");
			this.attr({z: 6});//position and visible layer
			//this.origin("center");//center the sprite image
			
			this.bind('EnterFrame', function() {
				this.x  = ((Crafty.viewport.x) * -1);//camera view port and off set
				this.y = ((Crafty.viewport.y - 352 ) * -1);//camera view port and off set
				this._displayname.x = this.x+5;
				this._displayname.y = this.y+5;
				
				this._displaymessage.x = this.x+5;
				this._displaymessage.y = this.y+20;
				
				this._talkbtn.x = this.x+5;
				this._talkbtn.y = this.y+110;
				//this._displayname.text(function () { return "My position is " + this._x });
			});
		},
		hidemenu:function(){
			this.visible = 0;
			this._displayname.visible = 0;
			this._displaymessage.visible = 0;
			this._talkbtn.visible = 0;
		},
		showmenu:function(){
			this.visible = 1;
			this._displayname.visible = 1;
			this._displaymessage.visible = 1;
			this._talkbtn.visible = 1;
			//console.log("CHARACTER NAME:"+this._charinfo);
			//console.log(this._charinfo);
			if(this._charinfo !=null){
				this._displayname.text("NPC:"+this._charinfo.charname);
				this._talktag = "default";
				this._count = 0;
				this.talk();
			}
		}
		
	});	
	
	
	Crafty.c("ChangeChar", {
		_currenttagname : "",
		_index:0,
		init: function() {
			this.addComponent("2D, DOM, Color, Mouse");
			this.w = 64;    // width
			this.h = 32;    // height
			//this.color("#969696");
			this.color("red");
			console.log("init box");
			//this.attr({x: 160, y: 144, z: 1});//position and visible layer
			//this.Text("Change Char");
			this.bind('EnterFrame', function() {
				this.x  = ((Crafty.viewport.x) * -1);//camera view port and off set
				this.y  = ((Crafty.viewport.y - 352 ) * -1);//camera view port and off set
			});
			this.bind("Click", function(obj) {
				console.log("click");
				this._index++;
				
				if(this._index > characters.length-1){
					this._index = 0;
				}
				currentchartag = characters[this._index]._id;
				console.log("characters._id:"+characters[this._index]._id);
				console.log(characters[this._index]);
            });
		}
	});
	
	Crafty.e("2D, Collision").collision(
		new Crafty.polygon([50,0], [100,100], [0,100])
	);
	
	Crafty.scene("main", function() {
		//var player = Crafty.e("Box");
		
		var player = Crafty.e("Ship");
		player.teamid = 0;
		//player.addComponent('CharacterStats');
		//player.CharacterStats();
		console.log(player.health);
		
		currentchartag = player._id = -1;
		
		
		var player2 = Crafty.e("Ship");
		player2.teamid = 1;
		player2.x = 92;
		player2.y = 32;
		player2._id = 2;
		
		//var monster = Crafty.e("CharacterSpawnPoint");
		//monster.x = 0;
		//monster.y = -64;
		
		//var wall = Crafty.e("Wall");
		//wall.x = -32;
		//wall.y = 0;
		
		
		//npcmenu = Crafty.e("NPCMenu");
		//Crafty.e("ChangeChar");
		
		//Crafty.e("2D, Collision").collision([50,0], [100,100], [0,100]);
	});

	// The loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		// Load takes an array of assets and a callback when complete
		Crafty.load([imagepath +"./sprite2.png"], function() {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});
    
		// Black background with some loading text
		Crafty.background("#AAAAAA");
		Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
		.text("Loading")
		.css({"text-align": "center"});
	});
	Crafty.scene("loading");
	
});


function ShowMenu(){

}

function HideMenu(){

}

var playerdata;

function spawnplayer(){
	if(playerdata == null){
		playerdata = Crafty.e("EnPlayer");
		console.log("spawning player");
	}
}

function ShowMenuNPC(){
	if(npcmenu == null){
		npcmenu = Crafty.e("NPCMenu");
	}else{
		console.log(npcmenu);
		npcmenu.visible = 1;
		//npcmenu.start();
	}
}


function HideMenuNPC(){
	if(npcmenu != null){
		npcmenu.visible = 0;
		//npcmenu.stop();
	}
}

//console.log(Crafty.map);
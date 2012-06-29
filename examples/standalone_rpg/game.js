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
	Crafty.sprite(32, imagepath+ "sprite2.png", {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		flower: [0,1],
		bush1:  [0,2],
		bush2:  [1,2]//,
		//player: [0,3]
	});
	
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
	
	
	Crafty.c('CharacterStats', {
		CharacterStats: function() {
			//console.log("init stats");
			this.health = 100;
			this.healthcap = 100;			
			return this;
		}
	});
	
	Crafty.c('CharacterShop', {
		CharacterShop: function() {
			this.shoptype = "item";
			this._items = [];
		}
	});
	
	Crafty.c('CharacterQuest', {
		CharacterShop: function() {
			this._quests = [];
		}
	});
	
	var charmessage = function (){
		this.index = 0;
		this.msgtype = "none";
		this.msgtext = "None";
		this._objectives = [];
		this._rewards = [];
		this._required = [];
	};
	
	Crafty.c("CharacterMessage", {
		CharacterMessage: function() {
			this._Messages = [];
			var msg = new charmessage();
			msg.msgtype = "default";
			msg.msgtext = "Hello Player";
			this._Messages.push(msg);
			console.log("INIT MESSAGE...");
			return this;
		}
	});
	
	Crafty.c('CharacterInfo', {
		CharacterInfo: function() {
			//console.log("init stats");
			this.chartype = "character";
			this.charid = "";
			this.charname = "charactername";
			this.userid = "";
			this.health = 100;
			this.healthcap = 100;	
			this.magic = 100;
			this.magiccap = 100;
			//this.idtag= {id:this.charid,name:this.charname};
			
			this.level = 0;
			this.experience = 0;
			
			this.attack = 10;
			this.defence = 1;
			this.magicattack = 1;
			this.magicdefence = 1;
			
			this.getcharname=function(){
				return this.charname;
			}
			
			this.setcharname=function(_char){
				this.charname = _char;
			}			
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
			//this.addComponent("2D, DOM, Color");
			this.addComponent("2D");
			this.w = 32;    // width
			this.h = 32;    // height
			//this.color("#969600");
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
	
	Crafty.c("EnNPC", {
		_id: 0,
		healthpoints:100,
		healthpointscap:100,
		__move: {left: false, right: false, up: false, down: false},    
		_speed: 3,
		_healthbar:null,
		_displayname:null,
		init: function() {
			__id++;
			this._id = __id;
			characters.push(this);
			console.log("init player");
			var move = this.__move;
			this._healthbar = Crafty.e("ProgressBar");
            this.addComponent("2D, DOM, SpriteAnimation, player, CharacterInfo, CharacterMessage");
			this.CharacterInfo();
			this.CharacterMessage();
			//console.log("NAME:"+this.charname);
			//this.charname = "NPC";
			//console.log("NAME:"+this.charname);
			this.setcharname("NPC");
			
			this.chartype = "npc";
			this._displayname = Crafty.e("2D, DOM, Text")
				.textFont({ family: 'Courier New' })
				//.color("#9696FF")
				.textFont({ size: '12px', weight: 'bold' })
				.attr({w:64,h:16,z:7 })
				.text(this.charname);
			this.attr({x: 0, y: 0, z: 3});//position and visible layer
			this.animate("walk_left", 6, 3, 8);
			this.animate("walk_right", 9, 3, 11);
			this.animate("walk_up", 3, 3, 5);
			this.animate("walk_down", 0, 3, 2);
			this.bind('EnterFrame', function() {
				//console.log("frame");
				// Move the player in a direction depending on the booleans
				// Only move the player in one direction at a time (up/down/left/right)
				this._healthbar.x = this.x;
				this._healthbar.y = this.y - 16;
				
				if(currentchartag == this._id){
				Crafty.viewport.x = ((this.x - 256) * -1);//camera view port and off set
				Crafty.viewport.y = ((this.y - 256 ) * -1);//camera view port and off set
				}
				
				this._displayname.x = this.x;
				this._displayname.y = this.y -32;
				this._healthbar.percent(this.health/this.healthcap);
				
				if (move.right) this.x += this._speed; 
				else if (move.left) this.x -= this._speed; 
				else if (move.up) this.y -= this._speed;
				else if (move.down) this.y += this._speed;
				
				if(this.__move.left) {
                    if(!this.isPlaying("walk_left"))
                        this.stop().animate("walk_left", 10);
                }
                if(this.__move.right) {
                    if(!this.isPlaying("walk_right"))
                        this.stop().animate("walk_right", 10);
                }
                if(this.__move.up) {
                    if(!this.isPlaying("walk_up"))
                        this.stop().animate("walk_up", 10);
                }
                if(this.__move.down) {
                    if(!this.isPlaying("walk_down"))
                        this.stop().animate("walk_down", 10);
                } 
			})
			this.bind('KeyDown', function(e){
				//console.log('key down');
				// Default movement booleans to false
				move.right = move.left = move.down = move.up = false;
				//console.log(Crafty.keys);
				// If keys are down, set the direction
				//console.log(socket);
				//console.log(getid());
				//console.log(this._id);
				if(currentchartag == this._id){
				if (e.keyCode === Crafty.keys.D){ 
					move.right = true;
					//if((socket !=null)&&(getid() == this._id)){
						//socket.emit('keyboard',{id:this._id,right:true});
					//}
				}
				if (e.keyCode === Crafty.keys.A){ 
					move.left = true;
					//if((socket !=null)&&(getid() == this._id)){
						//socket.emit('keyboard',{id:this._id,left:true});
					//}
				}
				
				if (e.keyCode === Crafty.keys.W){ 
					move.up = true;
					//if((socket !=null)&&(getid() == this._id)){
						//socket.emit('keyboard',{id:this._id,up:true});
					//}
				}
				if (e.keyCode === Crafty.keys.S){ 
					move.down = true;
					//if((socket !=null)&&(getid() == this._id)){
						//socket.emit('keyboard',{id:this._id,down:true});
					//}
				}
				}
				//this.preventTypeaheadFind(e);
			});
			this.bind('KeyUp', function(e) {
				//console.log('key up');
				// If key is released, stop moving
				if(currentchartag == this._id){
					if (e.keyCode === Crafty.keys.D){ 
						move.right = false;
					}
					if (e.keyCode === Crafty.keys.A){ 
						move.left = false;
					}
					if (e.keyCode === Crafty.keys.W){ 
						move.up = false;
					}
					if (e.keyCode === Crafty.keys.S){ 
						move.down = false;
					}
				}
				//this.preventTypeaheadFind(e);
			});
		}
	});	
	
	
	Crafty.c("EnMonster", {
		_id: 0,
		__move: {left: false, right: false, up: false, down: false},    
		_speed: 3,
		_dir:{x:0,y:0},
		_healthbar:null,
		_displayname:null,
		init: function() {
			__id++;
			this._id = __id;
			characters.push(this);
			console.log("init player");
			var move = this.__move;
			this._healthbar = Crafty.e("ProgressBar");
            this.addComponent("2D, DOM, SpriteAnimation, player, CharacterInfo");
			this.CharacterInfo();
			this.charname = "Monster";
			this.chartype = "monster";
			this._displayname = Crafty.e("2D, DOM, Text")
				.textFont({ family: 'Courier New' })
				//.color("#9696FF")
				.textFont({ size: '12px', weight: 'bold' })
				.attr({w:64,h:16,z:7 })
				.text(this.charname);
			this.attr({x: 0, y: 0, z: 3});//position and visible layer
			this.animate("walk_left", 6, 3, 8);
			this.animate("walk_right", 9, 3, 11);
			this.animate("walk_up", 3, 3, 5);
			this.animate("walk_down", 0, 3, 2);
			this.bind('EnterFrame', function() {
				this._displayname.x = this.x;
				this._displayname.y = this.y -32;
				
				//console.log("frame");
				// Move the player in a direction depending on the booleans
				// Only move the player in one direction at a time (up/down/left/right)
				this._healthbar.x = this.x;
				this._healthbar.y = this.y - 16;
				this._healthbar.percent(this.health/this.healthcap);

				if(this.health < 0){
					this.destroy();
				}
				
				if(currentchartag == this._id){
				Crafty.viewport.x = ((this.x - 256) * -1);//camera view port and off set
				Crafty.viewport.y = ((this.y - 256 ) * -1);//camera view port and off set
				}
				
				if (move.right){ this.x += this._speed; this._dir.x = 1;this._dir.y = 0;}
				else if (move.left){ this.x -= this._speed; this._dir.x = -1;this._dir.y = 0; }
				else if (move.up){ this.y -= this._speed; this._dir.x = 0;this._dir.y = -1;}
				else if (move.down){ this.y += this._speed; this._dir.x = 0;this._dir.y = 1;}
				
				if(this.__move.left) {
                    if(!this.isPlaying("walk_left"))
                        this.stop().animate("walk_left", 10);
                }
                if(this.__move.right) {
                    if(!this.isPlaying("walk_right"))
                        this.stop().animate("walk_right", 10);
                }
                if(this.__move.up) {
                    if(!this.isPlaying("walk_up"))
                        this.stop().animate("walk_up", 10);
                }
                if(this.__move.down) {
                    if(!this.isPlaying("walk_down"))
                        this.stop().animate("walk_down", 10);
                } 
			})
			this.bind('KeyDown', function(e){
				//console.log('key down');
				// Default movement booleans to false
				move.right = move.left = move.down = move.up = false;
				//console.log(Crafty.keys);
				// If keys are down, set the direction
				//console.log(socket);
				//console.log(getid());
				//console.log(this._id);
				if(currentchartag == this._id){
				if (e.keyCode === Crafty.keys.D){ 
					move.right = true;
					//if((socket !=null)&&(getid() == this._id)){
						//socket.emit('keyboard',{id:this._id,right:true});
					//}
				}
				if (e.keyCode === Crafty.keys.A){ 
					move.left = true;
					//if((socket !=null)&&(getid() == this._id)){
						//socket.emit('keyboard',{id:this._id,left:true});
					//}
				}
				
				if (e.keyCode === Crafty.keys.W){ 
					move.up = true;
					//if((socket !=null)&&(getid() == this._id)){
						//socket.emit('keyboard',{id:this._id,up:true});
					//}
				}
				if (e.keyCode === Crafty.keys.S){ 
					move.down = true;
					//if((socket !=null)&&(getid() == this._id)){
						//socket.emit('keyboard',{id:this._id,down:true});
					//}
				}
				
				if (e.keyCode === Crafty.keys.F){ 
					//move.down = true;
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,down:true});
					}
					var monsterattacke = Crafty.e('MAttack');
					monsterattacke.x = this.x + (this._dir.x * 32);
					monsterattacke.y = this.y + (this._dir.y * 32);
					//console.log("E D");
				}
				
				}
				//this.preventTypeaheadFind(e);
			});
			this.bind('KeyUp', function(e) {
				//console.log('key up');
				// If key is released, stop moving
				if(currentchartag == this._id){
					if (e.keyCode === Crafty.keys.D){ move.right = false;
					}
					if (e.keyCode === Crafty.keys.A){ move.left = false;
					}
					if (e.keyCode === Crafty.keys.W){ move.up = false;
					}
					if (e.keyCode === Crafty.keys.S){ move.down = false;
					}
				}
				//this.preventTypeaheadFind(e);
			});
		},
		endelete:function(){
			this._healthbar.destroy();
			this._healthbar.endelete();
			this._healthbar = null;
			this._displayname.destroy();
			this._displayname = null;
			this.destroy();
		}
	});	
	
	
	Crafty.c("EnPlayer", {
		_id: 0,
		healthpoints:100,
		healthpointscap:100,
		__move: {left: false, right: false, up: false, down: false},
		action:"",
		_dir:{x:0,y:0},
		_speed: 3,
		_healthbar:null,
		_displayname:null,
		init: function() {
			
			__id++;
			this._id = __id;
			characters.push(this);
			console.log("init player");
			//console.log(this);
			var move = this.__move;
			this._healthbar = Crafty.e("ProgressBar");
            this.addComponent("2D, DOM, SpriteAnimation, player, CharacterInfo, Collision");
			this.sprite(0, 0, 32, 64);
			this.CharacterInfo();
			this.charname = "GUEST";
			this.chartype = "player";
			this._displayname = Crafty.e("2D, DOM, Text")
				.textFont({ family: 'Courier New' })
				//.color("#9696FF")
				.textFont({ size: '12px', weight: 'bold' })
				.attr({w:64,h:16,z:7 })
				.text(this.charname);
			
			this.attr({x: 0, y: 0, z: 3});//position and visible layer
			this.animate("walk_left", 0, 1, 3);
			this.animate("walk_right", 0, 2, 3);
			this.animate("walk_up", 0, 3, 3);
			this.animate("walk_down", 0, 0, 3);
			this.bind('EnterFrame', function() {
				this._displayname.x = this.x;
				this._displayname.y = this.y -32;
				//console.log("frame");
				// Move the player in a direction depending on the booleans
				// Only move the player in one direction at a time (up/down/left/right)
				this._healthbar.x = this.x;
				this._healthbar.y = this.y - 16;
				this._healthbar.percent(this.health/this.healthcap);
				if(currentchartag == this._id){
					Crafty.viewport.x = ((this.x - 256) * -1);//camera view port and off set
					Crafty.viewport.y = ((this.y - 256 ) * -1);//camera view port and off set
				}
				//if(socket == null){
				if (move.right){ this.x += this._speed; this._dir.x = 1;this._dir.y = 0;}
				else if (move.left){ this.x -= this._speed; this._dir.x = -1;this._dir.y = 0; }
				else if (move.up){ this.y -= this._speed; this._dir.x = 0;this._dir.y = -1;}
				else if (move.down){ this.y += this._speed; this._dir.x = 0;this._dir.y = 1;}
				//}
				if(this.__move.left) {
                    if(!this.isPlaying("walk_left"))
                        this.stop().animate("walk_left", 10);
                }
                if(this.__move.right) {
                    if(!this.isPlaying("walk_right"))
                        this.stop().animate("walk_right", 10);
                }
                if(this.__move.up) {
                    if(!this.isPlaying("walk_up"))
                        this.stop().animate("walk_up", 10);
                }
                if(this.__move.down) {
                    if(!this.isPlaying("walk_down"))
                        this.stop().animate("walk_down", 10);
                } 
				
			})
			this.bind('KeyDown', function(e){
				//console.log('key down');
				// Default movement booleans to false
				move.right = move.left = move.down = move.up = false;
				//console.log(Crafty.keys);
				// If keys are down, set the direction
				if(currentchartag == this._id){
				if (e.keyCode === Crafty.keys.D){ 
					move.right = true;
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,right:true});
					}
					*/
				}
				if (e.keyCode === Crafty.keys.A){ 
					move.left = true;
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,left:true});
					}
					*/
				}
				
				if (e.keyCode === Crafty.keys.W){ 
					move.up = true;
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,up:true});
					}
					*/
				}
				if (e.keyCode === Crafty.keys.S){ 
					move.down = true;
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,down:true});
					}
					*/
				}
				if (e.keyCode === Crafty.keys.E){ 
					//move.down = true;
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,down:true});
					}
					*/
					var pinteractnpc = Crafty.e('PInteractNPC');
					pinteractnpc.x = this.x + (this._dir.x * 32);
					pinteractnpc.y = this.y + (this._dir.y * 32);
					console.log("E D");
				}
				if (e.keyCode === Crafty.keys.F){ 
					//move.down = true;
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,down:true});
					}
					*/
					var pattack = Crafty.e('PAttack');
					pattack.x = this.x + (this._dir.x * 32);
					pattack.y = this.y + (this._dir.y * 32);
					
					console.log("F D");
				}
				}
				//this.preventTypeaheadFind(e);
			});
			this.bind('KeyUp', function(e) {
				//console.log('key up');
				if(currentchartag == this._id){
				// If key is released, stop moving
				if (e.keyCode === Crafty.keys.D){ move.right = false;
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,right:false});
					}
					*/
				}
				if (e.keyCode === Crafty.keys.A){ move.left = false;
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,left:false});
					}
					*/
				}
				if (e.keyCode === Crafty.keys.W){ move.up = false;
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,up:false});
					}
					*/
				}
				if (e.keyCode === Crafty.keys.S){ move.down = false;
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,down:false});
					}
					*/
				}
				if (e.keyCode === Crafty.keys.E){
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,down:false});
					}
					*/
					console.log("E U");
				}
				
				if (e.keyCode === Crafty.keys.F){
					/*
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,down:false});
					}
					*/
					console.log("F U");
				}
				}
				//this.preventTypeaheadFind(e);
			});
			this.onHit("Wall", function(targets) {
				console.log('hit wall');
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
		
		var player = Crafty.e("EnPlayer");
		//player.addComponent('CharacterStats');
		//player.CharacterStats();
		console.log(player.health);
		
		currentchartag = player._id;
		//var monster = Crafty.e("CharacterSpawnPoint");
		//monster.x = 0;
		//monster.y = -64;
		
		var wall = Crafty.e("Wall");
		wall.x = -32;
		wall.y = 0;
		var npc = Crafty.e("EnNPC");
		//console.log("--NAME:"+npc.charname);
		npc.x = -64;
		npc.y = 0;
		
		var monsteremitter =  Crafty.e("MonsterEmitter");
		monsteremitter.y = 128;
		
		
		npcmenu = Crafty.e("NPCMenu");
		Crafty.e("ChangeChar");
		
		Crafty.e("2D, Collision").collision([50,0], [100,100], [0,100]);
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
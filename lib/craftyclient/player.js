	Crafty.c("en_player", {
    	objid:'en_npc',
		_id: 0,
		__move: {left: false, right: false, up: false, down: false},
		__newpos: {x:0,y:0,z:0},
		_speed: 3,
		init: function() {
			var move = this.__move;
            this.addComponent("2D, DOM, Color, player, SpriteAnimation");
			console.log("init player");
			this.attr({x: 160, y: 144, z: 1});//position and visible layer
			this.animate("walk_left", 6, 3, 8);
			this.animate("walk_right", 9, 3, 11);
			this.animate("walk_up", 3, 3, 5);
			this.animate("walk_down", 0, 3, 2);
			this.bind('EnterFrame', function() {
				//console.log("frame");
				// Move the player in a direction depending on the booleans
				// Only move the player in one direction at a time (up/down/left/right)

				//if((socket ==null){
					//if (move.right) this.x += this._speed; 
					//else if (move.left) this.x -= this._speed; 
					//else if (move.up) this.y -= this._speed;
					//else if (move.down) this.y += this._speed;
				//}
				if(getid() == this._id){
					Crafty.viewport.x = ((this.x - 256) * -1);//camera view port and off set
					Crafty.viewport.y = ((this.y - 256 ) * -1);//camera view port and off set
				}

				if(id == this._id){
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
				}
				
			}).bind('KeyDown', function(e) {
				//console.log('key down');
				// Default movement booleans to false
				move.right = move.left = move.down = move.up = false;
				//console.log(Crafty.keys);
				// If keys are down, set the direction
				//console.log(socket);
				//console.log(getid());
				//console.log(this._id);
				if (e.keyCode === Crafty.keys.D){ move.right = true;
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,right:true});
					}
				}
				if (e.keyCode === Crafty.keys.A){ move.left = true;
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,left:true});
					}
				}
				
				if (e.keyCode === Crafty.keys.W){ move.up = true;
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,up:true});
					}
				}
				if (e.keyCode === Crafty.keys.S){ move.down = true;
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,down:true});
					}
				}
				//this.preventTypeaheadFind(e);
			}).bind('KeyUp', function(e) {
				//console.log('key up');
				// If key is released, stop moving
				if (e.keyCode === Crafty.keys.D){ move.right = false;
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,right:false});
					}
				}
				if (e.keyCode === Crafty.keys.A){ move.left = false;
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,left:false});
					}
				}
				if (e.keyCode === Crafty.keys.W){ move.up = false;
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,up:false});
					}
				}
				if (e.keyCode === Crafty.keys.S){ move.down = false;
					if((socket !=null)&&(getid() == this._id)){
						socket.emit('keyboard',{id:this._id,down:false});
					}
				}
				//this.preventTypeaheadFind(e);
			});
		}
	});	


window.onload = (function() {
    var WIDTH = 640,
        HEIGHT = 480;
        
    Crafty.init(WIDTH, HEIGHT);
	Crafty.background("#f0f0f0");
	Crafty.sprite(16, imagepath+"sprite.png", {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		flower: [0,1],
		bush1:  [0,2],
		bush2:  [1,2],
		player: [0,3]
	});

	Crafty.c("BoxPlayer", {
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
				/*
				if (move.right) this.x += this._speed; 
				else if (move.left) this.x -= this._speed; 
				else if (move.up) this.y -= this._speed;
				else if (move.down) this.y += this._speed;
				*/
				/*
				if(this.__newpos.x > this.x){
					this.x++;
					console.log('test');
				}else if (this.__newpos.x < this.x){
					this.x--;
					console.log('test');
				}else{
				
				}
				*/
				/*
				if(this.__newpos.y > this.y){
					this.y++;
				}else if (this.__newpos.y < this.y){
					this.x--;
				}else{
				
				}
				*/
				
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
				console.log(socket);
				console.log(getid());
				console.log(this._id);
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
	//Crafty.e("BoxPlayer");
	
	
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

    //automatically play the loading scene
    //Crafty.scene("disconnect");	
});
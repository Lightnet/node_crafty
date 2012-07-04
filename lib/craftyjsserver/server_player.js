/*
 * Created By:Lightnet
 * 
 * src link:https://bitbucket.org/Lightnet/node_crafty
 *
 *
*/

Crafty.c('player',{
	id : '',
	objname : 'player',
	interval : 33,
	bstop : false,
	socket : null,
	userid : null,
	username : null,
	__move : {left:false,right:false,up:false,down:false},
	_left : 'false',
	_right : false,
	_up : false,
	_down : false,
	__pos : {x:0, y:0, z:0},
    __pos2 : {x:0, y:0, z:0},
	io : null,
	init: function() {
		this.addComponent("2D, Collision");
		this.w = 32;    // width
		this.h = 32;    // height
		this.attr({x: 0, y: 0, z: 1});//position and visible layer
		this.bind('EnterFrame', function() {
			//console.log('spirit obj');
			if(this.__move.left){this.x --;}
			if(this.__move.right){this.x ++;}
			if(this.__move.up){this.y --;}
			if(this.__move.down){this.y ++;}
		
			if((this.x === this.__pos2.x)&&(this.y === this.__pos2.y)){
				//console.log("same position");
			}else{
				//this.__pos2 = this.__pos;//do not use this way it will assign same value. It just it will over ride and linking to same var.
				this.__pos2.x = this.x;
				this.__pos2.y = this.y;
				//console.log("update position");
				if(this.io !=null){
					//console.log('sending...');
					this.io.sockets.emit('position',{id:this.id,x:this.x,y:this.y});
				}
			}
		});
		this.onHit("Wall", function(targets) {
			console.log('hit wall');
		});
	},
	initsockets : function(_socket){
        this.socket = _socket;
		var self = this;
        if(this.socket !=null){
            this.socket.on('keyboard',function(data){
                //console.log("input from client...");
                if(data !=null){
                    if(data['up'] === true){self.__move.up = true;}
                    if(data['up'] === false){self.__move.up = false;}
                    if(data['down'] === true){self.__move.down = true;}
                    if(data['down'] === false){self.__move.down = false;}
                    if(data['left'] === true){self.__move.left = true;}
                    if(data['left'] === false){self.__move.left = false;}
                    if(data['right'] === true){self.__move.right = true;}
                    if(data['right'] === false){self.__move.right = false;}
                }
            });
        }        
    },
	dc:function (){
		this.io.sockets.emit('playerleft',{id:this.id});////send out player to be remove from clients
		this.io.sockets.emit('chat',{message:'User left channel...'});//set client id //deal camera set
	}
});
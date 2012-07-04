	Crafty.c("Wall", {
        objid:'Wall',
		serverid:'',
		init: function() {
			this.addComponent("2D, DOM, Color");
			this.w = 32;    // width
			this.h = 32;    // height
			this.color("#969600");
			this.attr({x: 0, y: 0, z: 1});//position and visible layer
			this.origin("center");//center the sprite image
			this.bind('EnterFrame', function() {
				//this.rotation += 1;
				//console.log(this.rotation);
			});
		}
	});	

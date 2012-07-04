Crafty.c("en_npc", {
	serverid:'',
    init: function() {
    	this.addComponent("2D, DOM, Color");
		this.w = 32;    // width
		this.h = 32;    // height
		this.color("#62C2F9");
		this.attr({x: 0, y: 0, z: 1});//position and visible layer
		this.origin("center");//center the sprite image
	}
});

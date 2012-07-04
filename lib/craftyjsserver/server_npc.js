Crafty.c("en_npc", {
    objid:'en_npc',
	serverid:'npc01',
    init: function() {
        this.requires("2D");
        this.addComponent("2D");
		this.w = 32;    // width
		this.h = 32;    // height
		this.attr({x: 64, y: 0, z: 1});//position and visible layer
		this.origin("center");//center the sprite image
		this.bind('EnterFrame', function() {
		
		});
	}
});

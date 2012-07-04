/*
 * Created By:Lightnet
 * 
 * src link:https://bitbucket.org/Lightnet/node_crafty
 *
 *
*/

	Crafty.c("Wall", {
		objname : 'wall',
		objid:'Wall',
		serverid:'',
		init: function() {
            this.requires("2D");
			this.addComponent("2D");
			this.w = 32;    // width
			this.h = 32;    // height
			this.attr({x: 0, y: 0, z: 1});//position and visible layer
		}
	});

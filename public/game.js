
window.onload = (function() {
    var WIDTH = 640,
        HEIGHT = 480;
        
    Crafty.init(WIDTH, HEIGHT);
	Crafty.background("#f0f0f0");
	
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
	//load libaray files for crafty here.
	loadjs('lib.js');
});
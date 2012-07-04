var fs = require('fs');
var util = require("util");
var events = require('events');


var filedata = fs.readFileSync(__dirname+'/craftynode.js','utf8');  //main crafty structures.
eval(filedata);

filedata = fs.readFileSync(__dirname+'/craftyjsmodules/'+"2d.js",'utf8'); // default crafty format not yet added.
eval(filedata);

filedata = fs.readFileSync(__dirname+'/craftyjsmodules/'+'collision.js','utf8'); // default crafty format not yet added.
eval(filedata);

//filedata = fs.readFileSync(__dirname+'/craftyjsserver/'+ 'server_npc.js','utf8'); // default crafty format not yet added.
//eval(filedata);

//Crafty.run();


//console.log(Crafty.components());
/*
Crafty.c("en_npc", {
    objid:'en_npc',
	serverid:'npc01',
    init: function() {
        this.addComponent("2D");
		this.w = 32;    // width
		this.h = 32;    // height
		this.attr({x: 64, y: 0, z: 1});//position and visible layer
		this.origin("center");//center the sprite image
		this.bind('EnterFrame', function() {

		});
	}
});

var npc = Crafty.e('n_npc');
	npc.serverid = 'npc01';
	console.log(npc.x);
	console.log(npc);
*/

Crafty.c("en_npc", {
    objid:'en_npc',
	serverid:'npc01',

    init: function() {
        //this.requires("2D");
        this.addComponent("2D");
		this.w = 32;    // width
		this.h = 32;    // height
		this.attr({x: 64, y: 0, z: 1});//position and visible layer
		this.origin("center");//center the sprite image
		this.bind('EnterFrame', function() {

		});
	}
});

//var npc = Crafty.e('n_npc');
	//npc.serverid = 'npc01';
	//console.log(npc.x);
	//console.log(npc);
var npc = Crafty.e('en_npc');
var data ={
 test:function(){
     
 },beta:function(){

 }

}
//npc.extend(data);


	//npc.serverid = 'npc01';
	//console.log(npc.x);
	console.log(npc);
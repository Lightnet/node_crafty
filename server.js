/*
 * Created By:Lightnet
 * 
 * src link:https://bitbucket.org/Lightnet/node_crafty
 *
 * Information: The server code is written in javacript.
 * This is for game server and site hosting.
 * Support by epxress and socket.io to able to host and check web pages.
*/

var socket=require("socket.io");
sys = require("util"),
fs = require('fs'),
express = require('express');
var app = require('express').createServer();

var configfile = fs.readFileSync('./config.json'),
      Config;

try {
    Config = JSON.parse(configfile);//str into object data
    //console.dir(Config);
  }
catch (err) {
    console.log('There has been an error parsing your config JSON.')
    console.log(err);
}

// disable layout
app.set("view options", {layout: false});
//app.register('.html', require('jade'));

app.configure('production', function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(__dirname + '/public',{ maxAge: 604800 }));
	app.use(express.static(__dirname + '/image',{ maxAge: 604800 }));
	app.use(express.errorHandler());
});

//main index
app.get('/', function(req, res){
    if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', 'public, max-age=' + (31557600000 / 1000));
	res.setHeader('Cache-Control', 'public, max-age=' + (31557600000 / 1000));
	res.setHeader("Content-Type", "text/html");
	var contents = fs.readFileSync(__dirname +"/./public/index.html", "UTF-8");
	res.end(contents);
	//console.log("client web page...");
});

//js
app.get('/js/:file', function(req, res) {
	var filename =__dirname + "/"+ './public/' + req.params.file;
//        console.log("file loading:>" + filename);
	fs.readFile(filename, function(err, data) {
		if(err) {
			res.send("Oops! Couldn't find that file.");
		} else {
			res.write(data);
			res.end();
		}
	});
});

//image
app.get('/image/:file', function(req, res) {
	var extension = req.url.substring(req.url.lastIndexOf('.') + 1);
	var cache = {
		'css': 86400,
		'png': 86400,
		'jpeg': 86400,
		'jpg': 86400,
		'js': 86400,
		'ico': 86400
	};
	//this deal with cache time out image in case it blink the image.
	var maxAge = cache[extension];
	if(maxAge) {
		res.setHeader('Cache-Control', 'max-age=' + maxAge);
	} else {
		res.setHeader('Cache-Control', 'max-age=0');
	}
	
    var filename =__dirname + "/"+ './image/' + req.params.file;
	//console.log("file loading:>" + filename);
	fs.readFile(filename, function(err, data) {
		if(err) {
			res.send("Oops! Couldn't find that file.");
		} else {
			res.write(data);
			res.end();
		}
	});
});

app.get('/favicon.ico', function(req, res) {
	console.log("icon " );
	var extension = req.url.substring(req.url.lastIndexOf('.') + 1);
	var cache = {
		'css': 86400,
		'png': 86400,
		'jpeg': 86400,
		'jpg': 86400,
		'js': 86400,
		'ico': 86400
	};
	//this deal with cache time out image in case it blink the image.
	var maxAge = cache[extension];
	if(maxAge) {
		res.setHeader('Cache-Control', 'max-age=' + maxAge);
	} else {
		res.setHeader('Cache-Control', 'max-age=0');
	}
	
	var filename =__dirname + "/"+ './image/favicon.ico';
	fs.readFile(filename, function(err, data) {
		if(err) {
			res.send("Oops! Couldn't find that file.");
		} else {
			res.write(data);
			res.end();
		}
	});
});

var io = socket.listen(app);
//io = new io.Socket();
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});
//disable debug logs
io.set('log level', 1);

//set server socket
var serversocket = require('./lib/socketio_server');
//init sockets
serversocket.set(io);

var port=process.env.PORT || Config.port;
app.listen(port,'0.0.0.0');
console.log(new Date());
var port=process.env.PORT || 8080;
var http=require('http');
var fs = require('fs');

var page = fs.readFileSync(__dirname+'/public/socketio.html','utf8');  //main crafty structures.

var app=http.createServer(function(req,res){
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.write("[testing socket] server listening to port:"+port+"<br>");
	res.write(page);
    res.end();
}).listen(port);
socket=require("socket.io");
io=socket.listen(app);
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
io.set('log level', 1);
io.sockets.on("connection",function(socket){
    console.log("new connection");
    socket.on("log",function(data){
        console.log(data['msg']);
        io.sockets.emit("log",{msg:"server send msg"});
    });
});
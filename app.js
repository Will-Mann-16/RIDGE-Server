var bodyParser = require("body-parser");
var cors = require("cors");
var express = require("express");
var app = express();
var http = require("http");

var verifyTokenApp = require("./auth").verifyTokenApp;

var uri = 'mongodb://127.0.0.1:27017';
//var uri = 'mongodb://127.0.0.1:27017/project-signium'
//var uri = 'mongodb://ridge-mongodb:jL74RbgxKAcBoQx8xChqtcQmUkR0ecixULdp8sfH4xpdkU4TXAkpyjk3DxqHDmE3Iby6HhaCCOOH5grAWFIQmw==@ridge-mongodb.documents.azure.com:10255/ridge-wellington?ssl=true&sslverifycertificate=false';
//var uri = "mongodb://ridge-wellington:qcyok9bI1fZVH8Y7lpTWH1HKbqQhKnMuq4eEbt7GCOLUCiHN75lCaKplHs43wBU9UusSkOgMX8uAca3ny6tVsA==@ridge-wellington.documents.azure.com:10255/wellington?ssl=true&replicaSet=globaldb";
//var uri = "mongodb://ridge-wellington:Vr0UcABS7Un4hqAeeu9yt3VAVjjVzDNmWytr1l2sHRlEE7J0mEIzyqp8tl3urWrVVEZmFt7l9wnj2bzVt7FhiA==@ridge-wellington.documents.azure.com:10255/?ssl=true&replicaSet=globaldb";
//var uri = 'mongodb://RIDGE:C0d1ngG33k@ridgewelly-shard-00-00-lamqk.mongodb.net:27017,ridgewelly-shard-00-01-lamqk.mongodb.net:27017,ridgewelly-shard-00-02-lamqk.mongodb.net:27017/test?ssl=true&replicaSet=RIDGEWelly-shard-0&authSource=admin'
var port = process.env.port || 8081;
var mongoose = require("mongoose");
mongoose.connect(uri);
var db = mongoose.connection;

app.use(
  cors({
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token",
    origin: "*"
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var crud = require("./crud");

var server = http.createServer(app);
var io = require("socket.io")(server, {
  log: false,
  agent: false,
  origins: "*:*",
  transports: [
    "websocket",
    "htmlfile",
    "xhr-polling",
    "jsonp-polling",
    "polling"
  ]
});

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function() {
  var routes = require("./routes");
  app.use("/api", routes.routes);
});

io.on("connect", function(socket) {
  var socketHouse;
  socket.on("socket-client-server-init", function(packet) {
    socketHouse = packet.house;
    socket.emit("socket-server-client-init");
  });
  socket.on("socket-client-server-redraw-major", function() {
    io.sockets.emit("socket-server-client-redraw-major", {
      house: socketHouse
    });
  });
  socket.on("socket-client-server-redraw-minor", function() {
    io.sockets.emit("socket-server-client-redraw-minor", {
      house: socketHouse
    });
  });
  socket.on("disconnect", function() {});
});

server.listen(port);

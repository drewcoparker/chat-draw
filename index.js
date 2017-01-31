// Include http and fs
var http = require("http");
var fs = require("fs");


var server = http.createServer((req, res) => {
    console.log("Someone connected via http");
    fs.readFile("index.html", "utf-8", (error, fileData) => {
        if (error) {
            // Respond with a 500 if erroneous
            res.writeHead(500, {"content-type": "text/html"});
            res.end(error);
        } else {
            res.writeHead(200, {"content-type": "text/html"});
            res.end(fileData);
        }
    });
});

var socketIo = require("socket.io");
// Sockets are going to listen to the server which is listening to port 8080.
var io = socketIo.listen(server);

// Handle socket connections...
var socketUsers = [];
io.sockets.on("connect", (socket) => {
    console.log("Socket connection!!");
    socketUsers.push({
        socketID: socket.id,
        name: "Anonymous"
    });
    io.sockets.emit("users", socketUsers);
    socket.on("messageToServer", (messageObject) => {
        console.log(`Someone's message: "${messageObject.message}"`);
        io.sockets.emit("messageToClient", {
            message: messageObject.message,
            date: new Date()
        })
    })
});

server.listen(8080);
console.log("Listening on port 8000");

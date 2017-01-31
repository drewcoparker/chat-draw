

var socketio = io.connect("http://127.0.0.1:8080");
socketio.on("users", (socketUsers) => {
    console.log(socketUsers);
    var newHTML = "";
    socketUsers.map((currSocket, index) => {
        newHTML += `<li class="user">${currSocket.name}</li>`;
    });
    document.getElementById("userNames").innerHTML = newHTML;
});

socketio.on("messageToClient", (messageObject) => {
    document.getElementById("userChats").innerHTML += `<div class="message">${messageObject.message} -- ${messageObject.date}</div>`;
});



// Client functions
function sendChatMessage() {
    event.preventDefault();
    var messageToSend = document.getElementById("chat-message").value;
    socketio.emit("messageToServer", {
        message: messageToSend,
        name: "Anonymous"
    });
}

// Canvas functions

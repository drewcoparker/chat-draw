

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
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Set up base options
var color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
var thickness = 10;
var mouseDown = false;
var mousePosition = {};
var lastMousePostion = null;
var colorPicker = document.getElementById("color-picker");
var thicknessPicker = document.getElementById("thickness");

colorPicker.addEventListener("change", (event) => {
    color = colorPicker.value;
})

thicknessPicker.addEventListener("change", (event) => {
    color = thicknessPicker.value;
})

canvas.addEventListener("mousedown", (event) => {
    mouseDown = true;
})

canvas.addEventListener("mouseup", (event) => {
    mouseDown = false;
})

canvas.addEventListener("mousemove", (event) => {
    // console.log(event);
    if (mouseDown) {
        var magicBrushX = event.pageX - canvas.offsetLeft;
        var magicBrushY = event.pageY - canvas.offsetTop;
        mousePosition = {
            x: magicBrushX,
            y: magicBrushY
        }

        if (lastMousePostion !== null) {
            context.strokeStyle = color;
            context.lineJoin = "round";
            context.lineCap = "round";
            context.lineWidth = thickness;
            context.beginPath();
            context.moveTo(lastMousePostion.x, lastMousePostion.y);
            context.lineTo(mousePosition.x, mousePosition.y);
            context.stroke();
            context.closePath();
        }

        var drawingDataForServer = {
            mousePosition: mousePosition,
            lastMousePostion: lastMousePostion,
            color: color,
            thickness: thickness
        }

        lastMousePostion = {
            x: mousePosition.x,
            y: mousePosition.y
        }

        socketio.emit("drawingToServer", drawingDataForServer);
        socketio.on("drawingToClients", (drawingData) => {
            context.strokeStyle = drawingData.color;
            context.lineJoin = "round";
            context.lineCap = "round";
            context.lineWidth = drawingData.thickness;
            context.beginPath();
            context.moveTo(drawingData.lastMousePostion.x, drawingData.lastMousePostion.y);
            context.lineTo(drawingData.mousePosition.x, drawingData.mousePosition.y);
            context.stroke();
            context.closePath();
        })
    }
})



var socketio = io.connect("http://localhost:8080/");
// socketio.on("users", (socketUsers) => {
//     console.log(socketUsers);
//     var newHTML = "";
//     socketUsers.map((currSocket, index) => {
//         newHTML += `<li class="user">${currSocket.name}</li>`;
//     });
//     document.getElementById("userNames").innerHTML = newHTML;
// });
//
// socketio.on("messageToClient", (messageObject) => {
//     document.getElementById("userChats").innerHTML += `<div class="message">${messageObject.message} -- ${messageObject.date}</div>`;
// });



// Client functions
// function sendChatMessage() {
//     event.preventDefault();
//     var messageToSend = document.getElementById("chat-message").value;
//     socketio.emit("messageToServer", {
//         message: messageToSend,
//         name: "Anonymous"
//     });
// }

// Canvas functions
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// var backgroundImage = new Image();
// backgroundImage.src = "assets/background.png";


var hero = new Hero("assets/hero.png", .5);


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
            // context.moveTo(lastMousePostion.x, lastMousePostion.y);
            context.lineTo(mousePosition.x, mousePosition.y);
            context.closePath();
            context.stroke();
        } else {
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





function Hero(image) {
    this.image = new Image();
    this.image.src = image;
    this.x = Math.floor(Math.random() * 440);
    this.y = Math.floor(Math.random() * 440);
}

Hero.prototype.update = function(keyDownEvent, speedModifier=5) {
    if (38 in keyDownEvent) {
        if (this.y >= 10) {
            this.y -= speedModifier;
        }
    }
    // if keyDown[39] is true, then user pressed the right arrow
    if (39 in keyDownEvent) {
        if (this.x <= 455) {
            this.x += speedModifier;
        }
    }
    // if keyDown[40] is true, then user pressed the down arrow
    if (40 in keyDownEvent) {
        if (this.y <= 413) {
            this.y += speedModifier;
        }
    }
    // if keyDown[37] is true, then user pressed the left arrow
    if (37 in keyDownEvent) {
        if (this.x >= 22) {
            this.x -= speedModifier;
        }
    }
}




var keysDown = {};

addEventListener('keydown', function(event) {
    keysDown[event.keyCode] = true;
}, false);

addEventListener('keyup', function(event) {
    delete keysDown[event.keyCode];
}, false);






function draw() {

    hero.update(keysDown);
    // context.drawImage(backgroundImage, 0, 0);
    context.drawImage(hero.image, hero.x, hero.y);

    // socketio.emit("drawingToServer", )
    socketio.on("drawingToClients", (canvasData) => {
        hero.update(keysDown);
        // context.drawImage(backgroundImage, 0, 0);
        context.drawImage(hero.image, hero.x, hero.y);
    });

    requestAnimationFrame(draw);
}

draw();

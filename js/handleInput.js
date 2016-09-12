var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var rotationMatrix = mat4.create();
mat4.identity(rotationMatrix);

/* mouse */

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;
    var speedFactor = 2;

    var newRotationMatrix = mat4.create();
    mat4.identity(newRotationMatrix);

    var deltaX = newX - lastMouseX;
    mat4.rotate(newRotationMatrix, degToRad(deltaX / speedFactor), [0, 1, 0]);

    // var deltaY = newY - lastMouseY;
    // mat4.rotate(newRotationMatrix, degToRad(deltaY / speedFactor), [1, 0, 0]);

    mat4.multiply(newRotationMatrix, rotationMatrix, rotationMatrix);

    lastMouseX = newX
    lastMouseY = newY;
}

/* keyboard */

var currentlyPressedKeys = {};

var translationMatrix = mat4.create();
mat4.identity(translationMatrix);

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    if (currentlyPressedKeys[65]) { // A
        x += 0.05;
    }
    if (currentlyPressedKeys[68]) { // D
        x -= 0.05;
    }
    if (currentlyPressedKeys[33]) { // Page Up
        y += 0.05;
    }
    if (currentlyPressedKeys[34]) { // Page Down
        y -= 0.05;
    }
    if (currentlyPressedKeys[87]) { // W
        z += 0.05;
    }
    if (currentlyPressedKeys[83]) { // S
        z -= 0.05;
    }
}

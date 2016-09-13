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
    var speedFactor = 4;

    var newRotationMatrix = mat4.create();
    mat4.identity(newRotationMatrix);

    var deltaX = newX - lastMouseX;
    mat4.rotate(newRotationMatrix, degToRad(deltaX / speedFactor), [0, 1, 0]);

    // var deltaY = newY - lastMousix, degToRad(deltaY / speedFactor), [1, 0, 0]);

    mat4.multiply(newRotationMatrix, rotationMatrix, rotationMatrix);

    lastMouseX = newX
    lastMouseY = newY;
}

/* keyboard */

var currentlyPressedKeys = {};

var rotationMatrixModel = mat4.create();
mat4.identity(rotationMatrixModel);

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    var factor = 0.07;
    var yawFactorDegrees = 2;
    if (currentlyPressedKeys[65]) { // A
        // xModel += factor;
        angleModel -= yawFactorDegrees;
    }
    if (currentlyPressedKeys[68]) { // D
        // xModel -= factor;
        angleModel += yawFactorDegrees;
    }
    if (currentlyPressedKeys[32]) { // Space pressed
        yModel += factor;
    }
    if (!currentlyPressedKeys[32]) { // No space pressed
        if (yModel > 0) {
            yModel -= factor;
        }
    }
    if (currentlyPressedKeys[33]) { // Page Up
        zScene += 2 * factor;
    }
    if (currentlyPressedKeys[34]) { // Page Down
        zScene -= 2 * factor;
    }
    if (currentlyPressedKeys[87]) { // W || S
        zModel += factor * Math.cos(degToRad(angleModel));
        xModel -= factor * Math.sin(degToRad(angleModel));
    }
    if (currentlyPressedKeys[83]) { // S
        zModel -= factor * Math.cos(degToRad(angleModel));
        xModel += factor * Math.sin(degToRad(angleModel));
    }
}

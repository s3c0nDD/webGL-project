var gl;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {}
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(currentProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(currentProgram.mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(currentProgram.nMatrixUniform, false, normalMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

var moonAngle = 180;
var cubeAngle = 0;

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    var perFragmentLighting = document.getElementById("per-fragment").checked;
    if (perFragmentLighting) {
        currentProgram = perFragmentProgram;
    } else {
        currentProgram = perVertexProgram;
    }
    gl.useProgram(currentProgram);

    var lighting = document.getElementById("lighting").checked;
    gl.uniform1i(currentProgram.useLightingUniform, lighting);
    if (lighting) {
        gl.uniform3f(
            currentProgram.ambientColorUniform,
            parseFloat(document.getElementById("ambientR").value),
            parseFloat(document.getElementById("ambientG").value),
            parseFloat(document.getElementById("ambientB").value)
        );

        gl.uniform3f(
            currentProgram.pointLightingLocationUniform,
            parseFloat(document.getElementById("lightPositionX").value),
            parseFloat(document.getElementById("lightPositionY").value),
            parseFloat(document.getElementById("lightPositionZ").value)
        );

        gl.uniform3f(
            currentProgram.pointLightingColorUniform,
            parseFloat(document.getElementById("pointR").value),
            parseFloat(document.getElementById("pointG").value),
            parseFloat(document.getElementById("pointB").value)
        );
    }

    var textures = document.getElementById("textures").checked;
    gl.uniform1i(currentProgram.useTexturesUniform, textures);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [0, 0, -5]);

    mat4.rotate(mvMatrix, degToRad(30), [1, 0, 0]);

    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(moonAngle), [0, 1, 0]);
    mat4.translate(mvMatrix, [2, 0, 0]);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, moonTexture);
    gl.uniform1i(currentProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexPositionBuffer);
    gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, moonVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexTextureCoordBuffer);
    gl.vertexAttribPointer(currentProgram.textureCoordAttribute, moonVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexNormalBuffer);
    gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, moonVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, moonVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, moonVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();

    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(cubeAngle), [0, 1, 0]);
    mat4.translate(mvMatrix, [1.25, 0, 0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(currentProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, crateTexture);
    gl.uniform1i(currentProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}

var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        moonAngle += 0.05 * elapsed;
        cubeAngle += 0.05 * elapsed;
    }
    lastTime = timeNow;
}

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate(); // because no mouse handling
}

function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();
    initBuffers();
    initTexture();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // canvas.onmousedown = handleMouseDown;
    // document.onmouseup = handleMouseUp;
    // document.onmousemove = handleMouseMove;

    tick();
}

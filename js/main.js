function setLigth() {
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
}

function drawMoon() {
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
}

function drawCube() {
    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(cubeAngle), [0, 1, 0]);
    mat4.translate(mvMatrix, [1.25, 0, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(currentProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, crateTexture);
    gl.uniform1i(currentProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}

var xModel = 0;
var yModel = 0;
var zModel = 0;

var zScene = -10;
var mapScaleFactor = 20

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    setLigth();

    var textures = document.getElementById("textures").checked;
    gl.uniform1i(currentProgram.useTexturesUniform, textures);

    mat4.identity(mvMatrix);

    /* set initial camera view */

    mat4.translate(mvMatrix, [0, 0, zScene]);
    mat4.rotate(mvMatrix, degToRad(30), [1, 0, 0]);
    mat4.translate(mvMatrix, [0, -1, 0.5]);

    /* move camera */
    mat4.multiply(mvMatrix, rotationMatrix);    // rotation from mouse
    mat4.rotate(mvMatrix, degToRad(180), [0, 1, 0]); // initial angle (behind the back of model)

    mat4.rotate(mvMatrix, degToRad(angleModel), [0, 1, 0]); // rotate camera with model
    mat4.translate(mvMatrix, [-xModel, -yModel, -zModel]);  // move camera "behind" model


    /* draw a model */
    mvPushMatrix();
    mat4.translate(mvMatrix, [xModel, yModel, zModel]);
    mat4.rotate(mvMatrix, degToRad(-angleModel), [0, 1, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
    gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // it's possible that the messh doesn't contain any texture coordinates
    // in this case, the texture vertexAttribArray will need to be disabled
    // before the call to drawElements
    if(!mesh.textures.length){
      gl.disableVertexAttribArray(currentProgram.textureCoordAttribute);
    }
    else{
      // if the texture vertexAttribArray has been previously
      // disabled, then it needs to be re-enabled
      gl.enableVertexAttribArray(currentProgram.textureCoordAttribute);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureBuffer);
      gl.vertexAttribPointer(currentProgram.textureCoordAttribute, mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tankTexture);
      gl.uniform1i(currentProgram.samplerUniform, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
    gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();

    /* draw a tower */
    mvPushMatrix();
    mat4.translate(mvMatrix, [xModel, yModel, zModel]);
    mat4.rotate(mvMatrix, degToRad(-angleModel), [0, 1, 0]);
    var newRotM = rotationMatrix;
    mat4.multiply(mvMatrix, rotationTowerMatrix);  // rotate with mouse

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh2.vertexBuffer);
    gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, mesh2.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // it's possible that the messh doesn't contain any texture coordinates
    // in this case, the texture vertexAttribArray will need to be disabled
    // before the call to drawElements
    if (!mesh2.textures.length){
      gl.disableVertexAttribArray(currentProgram.textureCoordAttribute);
    }
    else {
      // if the texture vertexAttribArray has been previously
      // disabled, then it needs to be re-enabled
      gl.enableVertexAttribArray(currentProgram.textureCoordAttribute);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh2.textureBuffer);
      gl.vertexAttribPointer(currentProgram.textureCoordAttribute, mesh2.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tankTexture);
      gl.uniform1i(currentProgram.samplerUniform, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh2.normalBuffer);
    gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, mesh2.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh2.indexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, mesh2.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();

    /* draw a square - terrain */
    mvPushMatrix();
    mat4.scale(mvMatrix, [mapScaleFactor, mapScaleFactor, mapScaleFactor]);
    mat4.translate(mvMatrix, [0.0, -0.05 * 1/mapScaleFactor, 0.0])

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexTextureCoordBuffer);
    gl.vertexAttribPointer(currentProgram.textureCoordAttribute, squareVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, desertTexture);
    gl.uniform1i(currentProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexNormalBuffer);
    gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, squareVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}

var lastTime = 0;

var moonAngle = 180;
var cubeAngle = 0;
var angleModel = 0;


function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        moonAngle += 0.05 * elapsed;
        cubeAngle += 0.05 * elapsed;
        angleModel += 0.08 * elapsed;
    }
    lastTime = timeNow;
}

function tick() {
    requestAnimFrame(tick);
    handleKeys();
    drawScene();
    // animate();
}

function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();
    initTexture();
    initBuffers(function() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        canvas.onmousedown = handleMouseDown;
        document.onmouseup = handleMouseUp;
        document.onmousemove = handleMouseMove;

        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        tick();
    });

}

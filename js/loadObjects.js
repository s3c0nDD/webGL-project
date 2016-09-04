function Star(startingDistance, rotationSpeed) {
    this.angle = 0;
    this.dist = startingDistance;
    this.rotationSpeed = rotationSpeed;

    // Set the colors to a starting value.
    this.randomiseColors();
}

function drawStar() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, starTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, starVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, starVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, starVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, starVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, starVertexPositionBuffer.numItems);
}

Star.prototype.draw = function(tilt, spin, twinkle) {
    mvPushMatrix();

    // Move to the star's position
    mat4.rotate(mvMatrix, degToRad(this.angle), [0.0, 1.0, 0.0]);
    mat4.translate(mvMatrix, [this.dist, 0.0, 0.0]);

    // Rotate back so that the star is facing the viewer
    mat4.rotate(mvMatrix, degToRad(-this.angle), [0.0, 1.0, 0.0]);
    mat4.rotate(mvMatrix, degToRad(-tilt), [1.0, 0.0, 0.0]);

    if (twinkle) {
        // Draw a non-rotating star in the alternate "twinkling" color
        gl.uniform3f(shaderProgram.colorUniform, this.twinkleR, this.twinkleG, this.twinkleB);
        drawStar();
    }

    // All stars spin around the Z axis at the same rate
    mat4.rotate(mvMatrix, degToRad(spin), [0.0, 0.0, 1.0]);

    // Draw the star in its main color
    gl.uniform3f(shaderProgram.colorUniform, this.r, this.g, this.b);
    drawStar();

    mvPopMatrix();
};

var effectiveFPMS = 60 / 1000;

Star.prototype.animate = function(elapsedTime) {
    this.angle += this.rotationSpeed * effectiveFPMS * elapsedTime;

    // Decrease the distance, resetting the star to the outside of
    // the spiral if it's at the center.
    this.dist -= 0.01 * effectiveFPMS * elapsedTime;
    if (this.dist < 0.0) {
        this.dist += 5.0;
        this.randomiseColors();
    }
};

Star.prototype.randomiseColors = function() {
    // Give the star a random color for normal
    // circumstances...
    this.r = Math.random();
    this.g = Math.random();
    this.b = Math.random();

    // When the star is twinkling, we draw it twice, once
    // in the color below (not spinning) and then once in the
    // main color defined above.
    this.twinkleR = Math.random();
    this.twinkleG = Math.random();
    this.twinkleB = Math.random();
};

var stars = [];

function initWorldObjects() {
    var numStars = 30;

    for (var i = 0; i < numStars; i++) {
        stars.push(new Star((i / numStars) * 5.0, i / numStars));
    }
}

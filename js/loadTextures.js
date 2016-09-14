function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
}

var moonTexture,
    crateTexture,
    girlTexture,
    desertTexture,
    tankTexture;

function initTexture() {
    moonTexture = gl.createTexture();
    moonTexture.image = new Image();
    moonTexture.image.onload = function () {
        handleLoadedTexture(moonTexture)
    }
    moonTexture.image.src = "../textures/moon.gif";

    crateTexture = gl.createTexture();
    crateTexture.image = new Image();
    crateTexture.image.onload = function () {
        handleLoadedTexture(crateTexture)
    }
    crateTexture.image.src = "../textures/crate.gif";

    girlTexture = gl.createTexture();
    girlTexture.image = new Image();
    girlTexture.image.onload = function () {
        handleLoadedTexture(girlTexture)
    }
    girlTexture.image.src = "../textures/girl.jpg";

    desertTexture = gl.createTexture();
    desertTexture.image = new Image();
    desertTexture.image.onload = function () {
        handleLoadedTexture(desertTexture)
    }
    desertTexture.image.src = "../textures/desert.jpg";

    tankTexture = gl.createTexture();
    tankTexture.image = new Image();
    tankTexture.image.onload = function () {
        handleLoadedTexture(tankTexture)
    }
    tankTexture.image.src = "../textures/tank.jpg";
}

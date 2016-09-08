function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function createProgram(fragmentShaderID, vertexShaderID) {
    var fragmentShader = getShader(gl, fragmentShaderID);
    var vertexShader = getShader(gl, vertexShaderID);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");
    shaderProgram.showSpecularHighlightsUniform = gl.getUniformLocation(shaderProgram, "uShowSpecularHighlights");
    shaderProgram.useTexturesUniform = gl.getUniformLocation(shaderProgram, "uUseTextures");
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
    shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingSpecularColor");
    shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingDiffuseColor");

    return shaderProgram;
}

var currentProgram;

function initShaders() {
    currentProgram = createProgram("per-fragment-lighting-fs", "per-fragment-lighting-vs");
    gl.useProgram(currentProgram);
}

precision mediump float;

attribute float rotation;
attribute float scale;
attribute float opacity;
attribute float selection;

uniform float size;
uniform float time;
uniform mat3 normalMat;
uniform vec3 mousePos;
uniform float brightness;
uniform vec3 worldLight;
uniform vec3 baseColor;
uniform sampler2D colorMap;
uniform float hueScale;
uniform float satScale;

varying float vRotation;
varying float vOpacity;
varying float vDistVolume;
varying float vBrightness;
varying float vLightVolume;
varying vec3 vOutputColor;

float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    float oldRange = oldMax - oldMin;
    float newRange = newMax - newMin;
    return (((oldValue - oldMin) * newRange) / oldRange) + newMin;
}

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float calculateBrightness() {
    float dist = distance(mousePos, position);
    return clamp(range(dist, 0.0, 350.0, 1.0, 0.0), 0.0, 1.0) * 0.2;
}

float calcLight() {
    float volume = dot(normalize(worldLight), normal);
    volume = range(volume, 0.0, 1.0, 0.75, 1.8);
    return volume;
}

float calcDistVolume() {
    float dist = distance(position, vec3(0.0));
    return clamp(range(dist, 800.0, 3000.0, 1.0, 0.0), 0.0, 1.0);
}

vec3 calcColor() {
    vec4 colorTexel = texture2D(colorMap, uv);
    
    return colorTexel.rgb;
}

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (size * scale) * (1000.0 / length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
    
    vRotation = rotation;
    vOpacity = opacity;
    
    vDistVolume = calcDistVolume();
    vBrightness = min(1.0, calculateBrightness() * brightness + selection);
    vLightVolume = calcLight() + selection;
    vOutputColor = calcColor();
}
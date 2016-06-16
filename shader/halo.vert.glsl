precision highp float;
precision highp int;
#define SHADER_NAME ShaderMaterial
#define MAX_DIR_LIGHTS 0
#define MAX_POINT_LIGHTS 0
#define MAX_SPOT_LIGHTS 0
#define MAX_HEMI_LIGHTS 0
#define MAX_SHADOWS 0
#define GAMMA_FACTOR 2
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;

uniform sampler2D map;
uniform vec3 highlightColor;
uniform float worldAlpha;
uniform float lightDim;
uniform float lightAdjust;

varying float vRotation;
varying float vOpacity;
varying float vDistVolume;
varying float vBrightness;
varying float vLightVolume;
varying vec3 vOutputColor;

vec2 transformUV(vec2 uv, float a[9]) {
    
    // Convert UV to vec3 to apply matrices
    vec3 u = vec3(uv, 1.0);
    
    // Array consists of the following
    // 0 translate.x
    // 1 translate.y
    // 2 skew.x
    // 3 skew.y
    // 4 rotate
    // 5 scale.x
    // 6 scale.y
    // 7 origin.x
    // 8 origin.y
    
    // Origin before matrix
    mat3 mo1 = mat3(
                    1, 0, -a[7],
                    0, 1, -a[8],
                    0, 0, 1);
    
    // Origin after matrix
    mat3 mo2 = mat3(
                    1, 0, a[7],
                    0, 1, a[8],
                    0, 0, 1);
    
    // Translation matrix
    mat3 mt = mat3(
                   1, 0, -a[0],
                   0, 1, -a[1],
                   0, 0, 1);
    
    // Skew matrix
    mat3 mh = mat3(
                   1, a[2], 0,
                   a[3], 1, 0,
                   0, 0, 1);
    
    // Rotation matrix
    mat3 mr = mat3(
                   cos(a[4]), sin(a[4]), 0,
                   -sin(a[4]), cos(a[4]), 0,
                   0, 0, 1);
    
    // Scale matrix
    mat3 ms = mat3(
                   1.0 / a[5], 0, 0,
                   0, 1.0 / a[6], 0,
                   0, 0, 1);
    
    // apply translation
   	//u = u * mt;
    
    // apply skew
   	//u = u * mh;
    
    // apply rotation relative to origin
    u = u * mo1;
    u = u * mr;
    u = u * mo2;
    
    // apply scale relative to origin
    //u = u * mo1;
    //u = u * ms;
    //u = u * mo2;
    
    // Return vec2 of new UVs
    return u.xy;
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
float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    float oldRange = oldMax - oldMin;
    float newRange = newMax - newMin;
    return (((oldValue - oldMin) * newRange) / oldRange) + newMin;
}

vec2 rotate(vec2 uv) {
    float values[9];
    values[0] = 0.0; //x
    values[1] = 0.0; //y
    values[2] = 0.0; //skewX
    values[3] = 0.0; //skewY
    values[4] = vRotation; //rotation
    values[5] = 1.0; //scaleX
    values[6] = 1.0; //scaleY
    values[7] = 0.5; //originX
    values[8] = 0.5; //originY
    return transformUV(uv, values);
}

void main() {
    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    uv = rotate(uv);
    
    vec4 texel = texture2D(map, uv);
    float maxAlpha = texel.a;
    
    texel.a *= vOpacity;
    
    vec3 outputColor = vOutputColor;
    
    texel.rgb *= vLightVolume * lightDim;
    texel.a *= max(vLightVolume, 0.75);
    
    texel *= vec4(outputColor, texel.a);
    
    texel.rgb += vBrightness * vLightVolume;
    texel.rgb *= vDistVolume * lightAdjust;
    
    texel.a = min(maxAlpha + 0.2, texel.a);
    texel.a *= worldAlpha;
    
    
    gl_FragColor = texel;
}
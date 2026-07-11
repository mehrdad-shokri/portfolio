precision mediump float;
#define PI 3.14159265359

uniform sampler2D tex;
uniform sampler2D bloomTex;
uniform sampler2D paletteTex;
uniform float ditherMagnitude;
uniform float time;
uniform vec3 backgroundColor, cursorColor, glintColor;
uniform float cursorIntensity, glintIntensity;
// PORT PATCH: light-theme support. When invertRain is set, rain is composited
// as dark glyphs over a light background instead of additive glow on black.
uniform float invertRain;
uniform vec3 glyphColor;
varying vec2 vUV;

highp float rand( const in vec2 uv, const in float t ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c + t);
}

vec4 getBrightness(vec2 uv) {
	vec4 primary = texture2D(tex, uv);
	vec4 bloom = texture2D(bloomTex, uv);
	return primary + bloom;
}

void main() {
	vec4 brightness = getBrightness(vUV);

	// Dither: subtract a random value from the brightness
	brightness -= rand( gl_FragCoord.xy, time ) * ditherMagnitude / 3.0;

	// Map the brightness to a position in the palette texture, plus the
	// additive cursor and glint contributions.
	vec3 rain = texture2D( paletteTex, vec2(brightness.r, 0.0)).rgb
		+ min(cursorColor * cursorIntensity * brightness.g, vec3(1.0))
		+ min(glintColor * glintIntensity * brightness.b, vec3(1.0));

	vec3 color;
	if (invertRain > 0.5) {
		// Light theme: use the rain's intensity as coverage and darken the
		// light background toward glyphColor, giving crisp dark-on-light rain.
		float coverage = clamp(max(rain.r, max(rain.g, rain.b)), 0.0, 1.0);
		color = mix(backgroundColor, glyphColor, coverage);
	} else {
		// Dark theme: original additive glow over the (dark) background.
		color = rain + backgroundColor;
	}

	gl_FragColor = vec4(color, 1.0);
}

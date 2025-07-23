/**
 * Color Utility Functions for Color Blindness Simulation
 * 
 * This module contains functions for color space conversions and color matrix transformations
 * used to simulate various types of color vision deficiencies.
 */

/**
 * Convert sRGB color value to linear RGB
 * 
 * sRGB is the standard color space used by most displays and web browsers.
 * Linear RGB is used for accurate color calculations and transformations.
 * 
 * @param {number} c - sRGB color value (0-1)
 * @returns {number} Linear RGB value
 */
export function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear RGB color value to sRGB
 * 
 * This is the inverse of srgbToLinear, converting back to the standard sRGB color space.
 * 
 * @param {number} c - Linear RGB color value (0-1)
 * @returns {number} sRGB color value
 */
export function linearToSrgb(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/**
 * Apply color transformation matrix to RGB color values
 * 
 * This function simulates color blindness by applying a 3x3 transformation matrix
 * to the input RGB values. The process involves:
 * 1. Converting sRGB to linear RGB for accurate calculations
 * 2. Applying the transformation matrix
 * 3. Converting back to sRGB
 * 4. Blending with original color based on strength parameter
 * 
 * @param {number[]} rgb - Array of [r, g, b] values (0-255)
 * @param {number[][]} matrix - 3x3 transformation matrix
 * @param {number} strength - Simulation strength (0-1, default 1)
 * @returns {number[]} Transformed RGB values
 */
export function applyColorMatrix([r, g, b], matrix, strength = 1) {
  // Convert sRGB values (0-255) to sRGB (0-1)
  const Rsrgb = r / 255;
  const Gsrgb = g / 255;
  const Bsrgb = b / 255;

  // Convert sRGB to linear RGB for accurate color calculations
  const R = srgbToLinear(Rsrgb);
  const G = srgbToLinear(Gsrgb);
  const B = srgbToLinear(Bsrgb);

  // Apply 3x3 transformation matrix to linear RGB values
  // matrix[i][j] represents how much of input channel j affects output channel i
  const rLin = matrix[0][0] * R + matrix[0][1] * G + matrix[0][2] * B;
  const gLin = matrix[1][0] * R + matrix[1][1] * G + matrix[1][2] * B;
  const bLin = matrix[2][0] * R + matrix[2][1] * G + matrix[2][2] * B;

  // Convert linear RGB back to sRGB
  const rSim = linearToSrgb(rLin);
  const gSim = linearToSrgb(gLin);
  const bSim = linearToSrgb(bLin);

  // Convert sRGB (0-1) to RGB (0-255) and clamp values
  const simColor = [
    Math.min(255, Math.max(0, Math.round(rSim * 255))),
    Math.min(255, Math.max(0, Math.round(gSim * 255))),
    Math.min(255, Math.max(0, Math.round(bSim * 255))),
  ];

  // Blend original color with simulated color based on strength parameter
  // strength = 0: original color, strength = 1: fully simulated color
  return [r, g, b].map((channel, i) =>
    Math.round(channel * (1 - strength) + simColor[i] * strength)
  );
}

/**
 * Convert RGB array to CSS rgb() string
 * 
 * @param {number[]} rgb - Array of [r, g, b] values (0-255)
 * @returns {string} CSS rgb() color string
 */
export function rgbToCss(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/**
 * Convert HSV (Hue, Saturation, Value) to RGB
 * 
 * HSV is a more intuitive color space for generating color grids and palettes.
 * This function converts HSV values to RGB for display purposes.
 * 
 * @param {number} h - Hue in degrees (0-360)
 * @param {number} s - Saturation (0-1)
 * @param {number} v - Value/Brightness (0-1)
 * @returns {number[]} RGB values [r, g, b] (0-255)
 */
export function hsvToRgb(h, s, v) {
  // Calculate chroma (color intensity)
  let c = v * s;
  // Calculate intermediate value for RGB calculation
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  // Calculate lightness adjustment
  let m = v - c;
  let r1, g1, b1;

  // Convert HSV to RGB based on hue sector
  if (h < 60)      [r1, g1, b1] = [c, x, 0];      // Red to Yellow
  else if (h < 120) [r1, g1, b1] = [x, c, 0];      // Yellow to Green
  else if (h < 180) [r1, g1, b1] = [0, c, x];      // Green to Cyan
  else if (h < 240) [r1, g1, b1] = [0, x, c];      // Cyan to Blue
  else if (h < 300) [r1, g1, b1] = [x, 0, c];      // Blue to Magenta
  else              [r1, g1, b1] = [c, 0, x];      // Magenta to Red

  // Convert to RGB (0-255) and add lightness adjustment
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}
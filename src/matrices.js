/**
 * Color Blindness Transformation Matrices
 * 
 * This module contains 3x3 transformation matrices used to simulate various types of color vision deficiencies.
 * Each matrix represents how the three types of cone cells (red, green, blue) in the human eye
 * respond to different wavelengths of light in people with color blindness.
 * 
 * The matrices are based on scientific research and clinical studies of color vision deficiencies.
 * Different algorithms (Brettel, Vienot, Machado) provide varying levels of accuracy and computational efficiency.
 */

export const colorBlindMatrices = {
  normal: {
    name: 'Normal',
    label: 'Normal Vision',
    matrix: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  },

  protanopia: {
    name: 'Protanopia',
    label: 'Red-Blind',
    algorithms: {
      brettel: [
        [0.0, 1.05118294, -0.05116099],
        [0.0, 1, 0],
        [0.0, 0, 1],
      ],
      vienot: [
        [0.152286, 1.052583, -0.204868],
        [0.114503, 0.786281, 0.099216],
        [-0.003882, -0.048116, 1.051998],
      ],
      machado: [
        [0.567, 0.433, 0.0],
        [0.558, 0.442, 0.0],
        [0.0, 0.242, 0.758],
      ],
    },
  },

  protanomaly: {
    name: 'Protanomaly',
    label: 'Red-Weak',
    algorithms: {
      brettel: [
        [0.817, 0.183, 0],
        [0.333, 0.667, 0],
        [0, 0.125, 0.875],
      ],
      vienot: [
        [0.815, 0.185, 0],
        [0.318, 0.682, 0],
        [0, 0.110, 0.890],
      ],
      machado: [
        [0.817, 0.183, 0],
        [0.333, 0.667, 0],
        [0, 0.125, 0.875],
      ],
    },
  },

  deuteranopia: {
    name: 'Deuteranopia',
    label: 'Green-Blind',
    algorithms: {
      brettel: [
        [1, 0, 0],
        [0.9513092, 0, 0.04866992],
        [0, 0, 1],
      ],
      vienot: [
        [0.367322, 0.860646, -0.227968],
        [0.280085, 0.672501, 0.047413],
        [-0.011820, 0.042940, 0.968881],
      ],
      machado: [
        [1, 0, 0],
        [0.9513092, 0, 0.04866992],
        [0, 0, 1],
      ],
    },
  },

  deuteranomaly: {
    name: 'Deuteranomaly',
    label: 'Green-Weak',
    algorithms: {
      brettel: [
        [0.8, 0.2, 0],
        [0.258, 0.742, 0],
        [0, 0.142, 0.858],
      ],
      vienot: [
        [0.8, 0.2, 0],
        [0.255, 0.745, 0],
        [0, 0.130, 0.870],
      ],
      machado: [
        [0.8, 0.2, 0],
        [0.258, 0.742, 0],
        [0, 0.142, 0.858],
      ],
    },
  },

  tritanopia: {
    name: 'Tritanopia',
    label: 'Blue-Blind',
    algorithms: {
      brettel: [
        [1, 0, 0],
        [0, 1, 0],
        [-0.86744736, 1.86727089, 0],
      ],
      vienot: [
        [1.255528, -0.076749, -0.178779],
        [-0.078411, 0.930809, 0.147602],
        [0.004733, 0.691367, 0.303900],
      ],
      machado: [
        [1, 0, 0],
        [0, 1, 0],
        [-0.86744736, 1.86727089, 0],
      ],
    },
  },

  tritanomaly: {
    name: 'Tritanomaly',
    label: 'Blue-Weak',
    algorithms: {
      brettel: [
        [0.967, 0.033, 0],
        [0, 0.733, 0.267],
        [0, 0.183, 0.817],
      ],
      vienot: [
        [0.97, 0.03, 0],
        [0, 0.72, 0.28],
        [0, 0.18, 0.82],
      ],
      machado: [
        [0.967, 0.033, 0],
        [0, 0.733, 0.267],
        [0, 0.183, 0.817],
      ],
    },
  },

  achromatopsia: {
    name: 'Achromatopsia',
    label: 'Monochrome',
    matrix: [
        [0.299, 0.587, 0.114],
        [0.299, 0.587, 0.114],
        [0.299, 0.587, 0.114],
    ],
  }
};

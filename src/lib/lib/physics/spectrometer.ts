export const STANDARD_WAVELENGTHS = {
  Violet: 410e-9,
  Indigo: 434e-9,
  Blue: 486e-9,
  Green: 546.1e-9, // Reference line
  Yellow: 589e-9,
  Orange: 610e-9,
  Red: 656e-9
};

export const COLORS_HEX: Record<string, string> = {
  Violet: "#c084fc",
  Indigo: "#818cf8",
  Blue: "#38bdf8",
  Green: "#4ade80",
  Yellow: "#fde047",
  Orange: "#fb923c",
  Red: "#f87171",
  White: "#FFFFFF"
};

/**
 * Calculates diffraction angle in degrees.
 * lambda: Wavelength in meters.
 * N: Grating constant (lines per inch).
 * n: Spectrum order.
 */
export function calculateDiffractionAngle(lambda: number, N: number = 15000, n: number = 1): number {
  const gratingElement = 0.0254 / N; // meters
  const sinTheta = (n * lambda) / gratingElement;
  if (sinTheta > 1 || sinTheta < -1) return NaN;
  return Math.asin(sinTheta) * (180 / Math.PI);
}

export function getExpectedSpectrum(N: number = 15000, n: number = 1) {
  return Object.entries(STANDARD_WAVELENGTHS).map(([color, lambda]) => ({
    color,
    lambda,
    hex: COLORS_HEX[color],
    angle: calculateDiffractionAngle(lambda, N, n)
  }));
}

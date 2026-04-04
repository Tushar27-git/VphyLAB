export const NEWTONS_RINGS_CONSTANTS = {
  LAMBDA_SODIUM: 589e-9, // Wavelength of sodium light in meters
  RADIUS_CURVATURE: 1.0,  // Radius of curvature of plano-convex lens in meters
  MICROMETER_PITCH: 1.0,  // 1 mm pitch
  VERNIER_DIVISIONS: 100, // 100 divisions on circular scale
  LEAST_COUNT: 0.01       // mm (1 mm / 100)
};

/**
 * Calculates the theoretical diameter of the nth dark ring.
 * Formula: D_n = 2 * sqrt(n * lambda * R)
 * Returns diameter in millimeters.
 */
export function getDarkRingDiameter(n: number, lambda: number = NEWTONS_RINGS_CONSTANTS.LAMBDA_SODIUM, R: number = NEWTONS_RINGS_CONSTANTS.RADIUS_CURVATURE): number {
  if (n <= 0) return 0; // Central spot is dark (n=0 theoretically, though physically distinct)
  const diameterMeters = 2 * Math.sqrt(n * lambda * R);
  return diameterMeters * 1000; // Convert to mm for realistic micrometer reading scale
}

/**
 * Calculates the precise array of dark ring boundaries for HUD rendering.
 * Max order determines how many rings to compute.
 */
export function generateRingSystem(maxOrder: number = 30) {
  const rings = [];
  for (let n = 1; n <= maxOrder; n++) {
    rings.push({
      n,
      diameterMm: getDarkRingDiameter(n)
    });
  }
  return rings;
}

/**
 * Converts an absolute position in mm into realistic Main Scale and Vernier Scale readings.
 * @param absoluteMm Position along the rail (e.g., 25.46)
 */
export function getMicrometerReading(absoluteMm: number) {
  const msr = Math.floor(absoluteMm); // Main scale reading in mm
  
  // Get decimal part (e.g. 0.46) and convert to vernier divisions (0-99)
  const decimalPart = absoluteMm - msr;
  const vsr = Math.round(decimalPart * NEWTONS_RINGS_CONSTANTS.VERNIER_DIVISIONS);
  
  // Clean up floating point errors and handle boundary rollover
  let finalMSR = msr;
  let finalVSR = vsr;
  
  if (finalVSR >= 100) {
    finalVSR = 0;
    finalMSR += 1;
  }
  
  // Calculate the total derived from reading
  const total = finalMSR + (finalVSR * NEWTONS_RINGS_CONSTANTS.LEAST_COUNT);
  
  return { msr: finalMSR, vsr: finalVSR, total };
}

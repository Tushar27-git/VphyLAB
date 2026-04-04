import { useState, useMemo } from 'react';

interface NumericalApertureConfig {
  simulatedNA?: number; // Ground truth numerical aperture of the fiber (e.g. 0.22)
  initialDistanceMm?: number;
}

export const useNumericalAperture = ({
  simulatedNA = 0.22, // Typical commercially available step-index multimode fiber
  initialDistanceMm = 10.0,
}: NumericalApertureConfig = {}) => {
  const [distanceMm, setDistanceMm] = useState<number>(initialDistanceMm); // d
  
  // User's manual measurement of the diameter using virtual calipers
  const [caliperLeftMm, setCaliperLeftMm] = useState<number>(-2.5);
  const [caliperRightMm, setCaliperRightMm] = useState<number>(2.5);

  const physicsData = useMemo(() => {
    // theta_a = arcsin(NA)
    const acceptanceAngleRad = Math.asin(simulatedNA);
    
    // Radius of the projected spot on the screen R = d * tan(theta_a)
    const radiusMm = distanceMm * Math.tan(acceptanceAngleRad);
    const trueDiameterMm = radiusMm * 2;
    
    return {
      acceptanceAngleRad,
      radiusMm,
      trueDiameterMm,
      numericalAperture: simulatedNA,
    };
  }, [simulatedNA, distanceMm]);

  return {
    distanceMm,
    setDistanceMm,
    caliperLeftMm,
    setCaliperLeftMm,
    caliperRightMm,
    setCaliperRightMm,
    metrics: physicsData,
  };
};

import { useState, useMemo, useCallback, useRef } from 'react';

interface BarPendulumConfig {
  barLength?: number;         // L in meters (e.g., 1.0)
  gravity?: number;          // g in m/s^2 (default: 9.81)
  initialAngle?: number;     // Starting amplitude in radians
  dampingCoeff?: number;     // Damping coefficient γ (default: 0.03)
}

export const useBarPendulum = ({
  barLength = 1.0,
  gravity = 9.81,
  initialAngle = Math.PI / 12, 
  dampingCoeff = 0.03,
}: BarPendulumConfig = {}) => {
  // Discrete hole index (1 to 19). 
  // Hole 1 = 5cm from top, Hole 10 = 50cm (CG), Hole 19 = 95cm from top.
  const [selectedHole, setSelectedHole] = useState<number>(2);

  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Track the angle at which the pendulum was paused, so we can resume smoothly
  const pausedAngleRef = useRef<number>(0);
  const pausedAmplitudeRef = useRef<number>(initialAngle);
  // Track accumulated time across pause/resume cycles for damping continuity
  const totalSwingTimeRef = useRef<number>(0);
  const sessionStartTimeRef = useRef<number>(0);

  const physicsData = useMemo(() => {
    const holeSpacingMeters = 0.05; // 5 cm
    const distanceFromTopMeters = selectedHole * holeSpacingMeters;
    const cgPositionMeters = barLength / 2; // 0.50m
    
    // Signed distance: negative = above CG, positive = below CG
    const signedDistanceFromCG = distanceFromTopMeters - cgPositionMeters;
    
    // Absolute pivot distance (l) for formula
    const pivotDistanceL = Math.abs(signedDistanceFromCG);

    // k² = L²/12 for a uniform bar
    const kSquared = Math.pow(barLength, 2) / 12;

    let timePeriod = Infinity;
    if (pivotDistanceL > 0.001) { 
      timePeriod = 2 * Math.PI * Math.sqrt((kSquared + Math.pow(pivotDistanceL, 2)) / (gravity * pivotDistanceL));
    }

    // Stopwatch simulation: time for 20 vibrations, rounded to 2 decimals
    const exactTime20 = timePeriod === Infinity ? Infinity : timePeriod * 20;
    const measuredTime20 = timePeriod === Infinity ? Infinity : Math.round(exactTime20 * 100) / 100;

    const omega = timePeriod === Infinity ? 0 : (2 * Math.PI) / timePeriod;

    return {
      kSquared,
      signedDistanceFromCG,
      pivotDistanceL,
      timePeriod,
      measuredTime20,
      omega
    };
  }, [barLength, selectedHole, gravity]);

  // Damped oscillation: θ(t) = A₀ · e^(-γ·t) · cos(ω·t)
  // When paused and resumed, we continue from the total accumulated swing time
  const getCurrentAngle = useCallback((stopwatchTime: number) => {
    if (physicsData.omega === 0) return 0;
    
    // Total physical swing time = time accumulated before this session + current session time
    const currentSessionTime = stopwatchTime - sessionStartTimeRef.current;
    const totalTime = totalSwingTimeRef.current + (currentSessionTime > 0 ? currentSessionTime : 0);
    
    // Damped harmonic motion
    const amplitude = initialAngle * Math.exp(-dampingCoeff * totalTime);
    
    // If amplitude is negligibly small, stop oscillating
    if (amplitude < 0.001) return 0;
    
    return amplitude * Math.cos(physicsData.omega * totalTime);
  }, [initialAngle, physicsData.omega, dampingCoeff]);

  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => {
      if (prev) {
        // Pausing: save the current swing time for continuity
        // We need to capture how much time was spent in this session
        // This will be handled by the elapsed time at the moment of pause
      } else {
        // Resuming: record the stopwatch time at which this session starts
        setElapsedTime(current => {
          sessionStartTimeRef.current = current;
          return current;
        });
      }
      return !prev;
    });
  }, []);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    pausedAngleRef.current = 0;
    pausedAmplitudeRef.current = initialAngle;
    totalSwingTimeRef.current = 0;
    sessionStartTimeRef.current = 0;
  }, [initialAngle]);

  const tickTime = useCallback((deltaSec: number) => {
    setElapsedTime(prev => {
      const next = prev + deltaSec;
      // Update the total swing time for damping calculation
      totalSwingTimeRef.current = next - sessionStartTimeRef.current;
      return next;
    });
  }, []);

  return {
    selectedHole,
    setSelectedHole,
    metrics: physicsData,
    simulationState: {
      isRunning,
      elapsedTime,
      toggleSimulation,
      resetSimulation,
      getCurrentAngle,
      tickTime,
    }
  };
};


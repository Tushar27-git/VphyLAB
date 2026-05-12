import { useRef, useState, useCallback, useEffect } from 'react';

// System Constants
export const SYSTEM_CONSTANTS = {
  R: 10000,           // Ohms (10kΩ)
  C: 0.0047,          // Farads (4700μF)
  V0: 5,              // Volts
};

export const THEORETICAL_VALUES = {
  timeConstant: SYSTEM_CONSTANTS.R * SYSTEM_CONSTANTS.C,  // 47 seconds
  halfLife: (SYSTEM_CONSTANTS.R * SYSTEM_CONSTANTS.C) * Math.LN2,  // 32.57 seconds
  capacitance: SYSTEM_CONSTANTS.C,  // 0.0047 F
};

export type CircuitPhase = 'idle' | 'charging' | 'discharging';

export interface CircuitState {
  phase: CircuitPhase;
  mainPowerOn: boolean;
  chargingOn: boolean;
  dischargingOn: boolean;
  currentVoltage: number;
  peakVoltage: number;
  phaseStartTime: number;
  elapsedTime: number;
}

export interface StopwatchState {
  isRunning: boolean;
  elapsedTime: number;
}

export interface RCCircuitHook {
  // Circuit state
  circuitState: CircuitState;
  stopwatchState: StopwatchState;
  
  // Control methods
  toggleMainPower: () => void;
  toggleCharging: () => void;
  toggleDischarging: () => void;
  dumpCapacitor: () => void;
  
  // Stopwatch methods
  startStopwatch: () => void;
  stopStopwatch: () => void;
  resetStopwatch: () => void;
  
  // Reset all
  resetAll: () => void;
  
  // Refs for high-frequency updates
  voltageRef: React.MutableRefObject<number>;
  stopwatchElRef: React.MutableRefObject<HTMLSpanElement | null>;
  
  // Theoretical values
  theoreticalValues: typeof THEORETICAL_VALUES;
  SYSTEM_CONSTANTS: typeof SYSTEM_CONSTANTS;
}

export function useRCCircuit(): RCCircuitHook {
  // Circuit state
  const [circuitState, setCircuitState] = useState<CircuitState>({
    phase: 'idle',
    mainPowerOn: false,
    chargingOn: false,
    dischargingOn: false,
    currentVoltage: 0,
    peakVoltage: 0,
    phaseStartTime: 0,
    elapsedTime: 0,
  });

  // Stopwatch state
  const [stopwatchState, setStopwatchState] = useState<StopwatchState>({
    isRunning: false,
    elapsedTime: 0,
  });

  // Refs for high-frequency updates (bypass React)
  const voltageRef = useRef<number>(0);
  const stopwatchElRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Control methods
  const toggleMainPower = useCallback(() => {
    setCircuitState(prev => ({
      ...prev,
      mainPowerOn: !prev.mainPowerOn,
      chargingOn: prev.mainPowerOn ? false : prev.chargingOn,
      dischargingOn: prev.mainPowerOn ? false : prev.dischargingOn,
    }));
  }, []);

  const toggleCharging = useCallback(() => {
    setCircuitState(prev => {
      if (!prev.mainPowerOn) return prev;
      
      const newChargingOn = !prev.chargingOn;
      const newPhase = newChargingOn ? 'charging' : 'idle';
      
      return {
        ...prev,
        chargingOn: newChargingOn,
        dischargingOn: false,
        phase: newPhase,
        phaseStartTime: newChargingOn ? Date.now() : prev.phaseStartTime,
        peakVoltage: !newChargingOn ? prev.currentVoltage : prev.peakVoltage,
      };
    });
  }, []);

  const toggleDischarging = useCallback(() => {
    setCircuitState(prev => {
      if (!prev.mainPowerOn) return prev;
      
      const newDischargingOn = !prev.dischargingOn;
      const newPhase = newDischargingOn ? 'discharging' : 'idle';
      
      return {
        ...prev,
        dischargingOn: newDischargingOn,
        chargingOn: false,
        phase: newPhase,
        phaseStartTime: newDischargingOn ? Date.now() : prev.phaseStartTime,
      };
    });
  }, []);

  const dumpCapacitor = useCallback(() => {
    setCircuitState(prev => ({
      ...prev,
      currentVoltage: 0,
      peakVoltage: 0,
      chargingOn: false,
      dischargingOn: false,
      phase: 'idle',
    }));
    voltageRef.current = 0;
  }, []);

  // Stopwatch methods
  const startStopwatch = useCallback(() => {
    setStopwatchState(prev => ({
      ...prev,
      isRunning: true,
    }));
    lastTimeRef.current = Date.now();
  }, []);

  const stopStopwatch = useCallback(() => {
    setStopwatchState(prev => ({
      ...prev,
      isRunning: false,
    }));
  }, []);

  const resetStopwatch = useCallback(() => {
    setStopwatchState({
      isRunning: false,
      elapsedTime: 0,
    });
    if (stopwatchElRef.current) {
      stopwatchElRef.current.textContent = '00:00.0';
    }
  }, []);

  // Reset all
  const resetAll = useCallback(() => {
    setCircuitState({
      phase: 'idle',
      mainPowerOn: false,
      chargingOn: false,
      dischargingOn: false,
      currentVoltage: 0,
      peakVoltage: 0,
      phaseStartTime: 0,
      elapsedTime: 0,
    });
    setStopwatchState({
      isRunning: false,
      elapsedTime: 0,
    });
    voltageRef.current = 0;
    if (stopwatchElRef.current) {
      stopwatchElRef.current.textContent = '00:00.0';
    }
  }, []);

  // Animation loop for physics calculations
  useEffect(() => {
    const animate = () => {
      setCircuitState(prev => {
        let newVoltage = prev.currentVoltage;
        let newPhase = prev.phase;

        if (prev.chargingOn && prev.phase === 'charging') {
          const elapsedTime = (Date.now() - prev.phaseStartTime) / 1000;
          const RC = SYSTEM_CONSTANTS.R * SYSTEM_CONSTANTS.C;
          newVoltage = SYSTEM_CONSTANTS.V0 * (1 - Math.exp(-elapsedTime / RC));
          newVoltage = Math.min(newVoltage, SYSTEM_CONSTANTS.V0);
        } else if (prev.dischargingOn && prev.phase === 'discharging') {
          const elapsedTime = (Date.now() - prev.phaseStartTime) / 1000;
          const RC = SYSTEM_CONSTANTS.R * SYSTEM_CONSTANTS.C;
          newVoltage = prev.peakVoltage * Math.exp(-elapsedTime / RC);
          newVoltage = Math.max(newVoltage, 0);
        }

        voltageRef.current = newVoltage;

        return {
          ...prev,
          currentVoltage: newVoltage,
        };
      });

      // Update stopwatch
      setStopwatchState(prev => {
        if (prev.isRunning) {
          const now = Date.now();
          const delta = (now - lastTimeRef.current) / 1000;
          const newElapsedTime = prev.elapsedTime + delta;
          lastTimeRef.current = now;

          // Update DOM directly for smooth display
          if (stopwatchElRef.current) {
            const minutes = Math.floor(newElapsedTime / 60);
            const seconds = Math.floor(newElapsedTime % 60);
            const deciseconds = Math.floor((newElapsedTime % 1) * 10);
            stopwatchElRef.current.textContent = 
              `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${deciseconds}`;
          }

          return {
            ...prev,
            elapsedTime: newElapsedTime,
          };
        }
        return prev;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    circuitState,
    stopwatchState,
    toggleMainPower,
    toggleCharging,
    toggleDischarging,
    dumpCapacitor,
    startStopwatch,
    stopStopwatch,
    resetStopwatch,
    resetAll,
    voltageRef,
    stopwatchElRef,
    theoreticalValues: THEORETICAL_VALUES,
    SYSTEM_CONSTANTS,
  };
}

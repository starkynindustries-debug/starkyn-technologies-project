import { useState, useEffect, useCallback, useRef } from 'react';
import { Settings } from './useSettings';

/**
 * Motor Data Types
 * These interfaces define the structure of data coming from ESP32 sensors
 */
export interface MotorMetrics {
  rpm: number;           // Motor speed in RPM (0-3000)
  voltage: number;       // Supply voltage in V (0-48)
  current: number;       // Load current in A (0-20)
  power: number;         // Power consumption in W (calculated)
  efficiency: number;    // System efficiency % (0-100)
  pwmDuty: number;       // Current PWM duty cycle (0-100)
  temperature: number;   // Motor temperature in °C (from LM35/DS18B20/NTC sensor)
}

export interface SystemStatus {
  motorState: 'idle' | 'running' | 'fault';
  thermalState: 'normal' | 'warning' | 'critical';
  controllerStatus: 'online' | 'offline';
  communicationStatus: 'stable' | 'interrupted';
  systemMode: 'prototype' | 'simulation';
  lastUpdate: Date;
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export interface PowerHistoryPoint {
  time: string;
  power: number;
  current: number;
}

interface UseMotorDataProps {
  settings: Settings;
}

interface UseMotorDataReturn {
  metrics: MotorMetrics;
  status: SystemStatus;
  powerHistory: PowerHistoryPoint[];
  isRunning: boolean;
  targetPwm: number;
  setTargetPwm: (pwm: number) => void;
  startMotor: () => void;
  stopMotor: () => void;
  emergencyStop: () => void;
}

/**
 * ESP32 API Endpoints
 * Customize based on your ESP32 firmware
 */
const API_ENDPOINTS = {
  getMetrics: '/api/metrics',
  setSpeed: '/api/speed',
  control: '/api/control',
  status: '/api/status',
};

/**
 * Simulates realistic motor behavior with physics-based calculations
 * Includes temperature modeling for thermal monitoring
 */
const simulateMotorBehavior = (
  currentMetrics: MotorMetrics,
  targetPwm: number,
  isRunning: boolean
): MotorMetrics => {
  // Base values when motor is stopped
  if (!isRunning) {
    // Temperature cools down when motor is off
    const ambientTemp = 25;
    const coolingRate = 0.02;
    const newTemp = currentMetrics.temperature - (currentMetrics.temperature - ambientTemp) * coolingRate;
    
    return {
      rpm: Math.max(0, currentMetrics.rpm * 0.85), // Gradual spindown
      voltage: 24 + (Math.random() - 0.5) * 0.2,   // Slight voltage fluctuation
      current: 0.1 + Math.random() * 0.05,          // Idle current
      power: 2.4 + Math.random() * 0.5,             // Standby power
      efficiency: 0,
      pwmDuty: 0,
      temperature: Math.round(Math.max(ambientTemp, newTemp) * 10) / 10,
    };
  }

  // Calculate target RPM based on PWM (linear relationship for simulation)
  const maxRpm = 3000;
  const targetRpm = (targetPwm / 100) * maxRpm;
  
  // Smooth acceleration/deceleration
  const rpmDiff = targetRpm - currentMetrics.rpm;
  const acceleration = rpmDiff * 0.15; // 15% per cycle for smooth response
  const newRpm = Math.max(0, currentMetrics.rpm + acceleration + (Math.random() - 0.5) * 10);
  
  // Voltage drops slightly under load
  const loadFactor = newRpm / maxRpm;
  const voltage = 24 - (loadFactor * 1.5) + (Math.random() - 0.5) * 0.3;
  
  // Current increases with load (non-linear)
  const baseCurrent = 0.5;
  const loadCurrent = Math.pow(loadFactor, 1.3) * 15;
  const current = baseCurrent + loadCurrent + (Math.random() - 0.5) * 0.3;
  
  // Power = Voltage × Current
  const power = voltage * current;
  
  // Efficiency calculation (peaks at mid-range, drops at extremes)
  const efficiencyBase = 85;
  const efficiencyPenalty = Math.abs(loadFactor - 0.6) * 20; // Best at 60% load
  const efficiency = isRunning && newRpm > 100 
    ? Math.max(0, efficiencyBase - efficiencyPenalty + (Math.random() - 0.5) * 2)
    : 0;

  /**
   * Temperature simulation (LM35/DS18B20/NTC sensor placeholder)
   * Temperature rises with power dissipation and load
   * Normal: 25-55°C, Warning: 55-75°C, Critical: >75°C
   */
  const ambientTemp = 25;
  const maxOperatingTemp = 85;
  const thermalResistance = 0.08; // °C per Watt
  const thermalTimeConstant = 0.03; // How fast temp changes
  
  const heatGenerated = power * (1 - efficiency / 100) * thermalResistance;
  const targetTemp = ambientTemp + (loadFactor * 35) + heatGenerated + (Math.random() - 0.5) * 1;
  const tempDiff = targetTemp - currentMetrics.temperature;
  const newTemp = Math.min(maxOperatingTemp, currentMetrics.temperature + tempDiff * thermalTimeConstant);

  return {
    rpm: Math.round(newRpm),
    voltage: Math.round(voltage * 10) / 10,
    current: Math.round(current * 100) / 100,
    power: Math.round(power * 10) / 10,
    efficiency: Math.round(efficiency * 10) / 10,
    pwmDuty: targetPwm,
    temperature: Math.round(newTemp * 10) / 10,
  };
};

/**
 * Custom hook for motor data management
 * Handles both simulated data and real ESP32 API integration
 */
export const useMotorData = ({ settings }: UseMotorDataProps): UseMotorDataReturn => {
  const [metrics, setMetrics] = useState<MotorMetrics>({
    rpm: 0,
    voltage: 24.0,
    current: 0.12,
    power: 2.88,
    efficiency: 0,
    pwmDuty: 0,
    temperature: 28.5, // Initial ambient temperature
  });

  const [status, setStatus] = useState<SystemStatus>({
    motorState: 'idle',
    thermalState: 'normal',
    controllerStatus: 'online',
    communicationStatus: 'stable',
    systemMode: settings.simulationMode ? 'simulation' : 'prototype',
    lastUpdate: new Date(),
    alerts: [],
  });

  const [powerHistory, setPowerHistory] = useState<PowerHistoryPoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [targetPwm, setTargetPwm] = useState(0);
  
  const metricsRef = useRef(metrics);
  metricsRef.current = metrics;

  /**
   * Fetch data from ESP32
   */
  const fetchFromESP32 = useCallback(async (): Promise<MotorMetrics | null> => {
    try {
      const response = await fetch(`${settings.apiBaseUrl}${API_ENDPOINTS.getMetrics}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setStatus(prev => ({
        ...prev,
        communicationStatus: 'stable',
      }));
      return {
        rpm: data.rpm,
        voltage: data.voltage,
        current: data.current,
        power: data.power || (data.voltage * data.current),
        efficiency: data.efficiency || 0,
        pwmDuty: data.pwm || 0,
        temperature: data.temperature || 28.5, // From LM35/DS18B20/NTC sensor
      };
    } catch (error) {
      console.error('ESP32 fetch error:', error);
      setStatus(prev => ({
        ...prev,
        communicationStatus: 'interrupted',
        alerts: [
          { id: Date.now().toString(), type: 'error', message: 'Lost connection to controller', timestamp: new Date() },
          ...prev.alerts.slice(0, 4),
        ],
      }));
      return null;
    }
  }, [settings.apiBaseUrl]);

  /**
   * Send command to ESP32
   */
  const sendToESP32 = useCallback(async (endpoint: string, data: object): Promise<boolean> => {
    if (settings.simulationMode) return true;
    try {
      const response = await fetch(`${settings.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.ok;
    } catch (error) {
      console.error('ESP32 send error:', error);
      return false;
    }
  }, [settings.apiBaseUrl, settings.simulationMode]);

  // Update power history for live chart
  const updatePowerHistory = useCallback((currentPower: number, currentCurrent: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      minute: '2-digit', 
      second: '2-digit' 
    });
    
    setPowerHistory(prev => {
      const newHistory = [...prev, { time: timeStr, power: currentPower, current: currentCurrent }];
      // Keep last 30 data points for rolling window
      return newHistory.slice(-30);
    });
  }, []);

  // Main data update loop
  useEffect(() => {
    const interval = setInterval(async () => {
      let newMetrics: MotorMetrics;
      
      if (settings.simulationMode) {
        // Simulation mode
        newMetrics = simulateMotorBehavior(metricsRef.current, targetPwm, isRunning);
      } else {
        // Real ESP32 mode
        const fetchedMetrics = await fetchFromESP32();
        if (fetchedMetrics) {
          newMetrics = fetchedMetrics;
        } else {
          // Fallback to current metrics on fetch failure
          newMetrics = metricsRef.current;
        }
      }
      
      setMetrics(newMetrics);
      
      // Determine thermal state based on temperature
      // Normal: <55°C, Warning: 55-75°C, Critical: >75°C
      const getThermalState = (temp: number): 'normal' | 'warning' | 'critical' => {
        if (temp >= 75) return 'critical';
        if (temp >= 55) return 'warning';
        return 'normal';
      };
      
      const thermalState = getThermalState(newMetrics.temperature);
      
      // Update status based on metrics
      setStatus(prev => ({
        ...prev,
        motorState: isRunning ? (newMetrics.rpm > 50 ? 'running' : 'idle') : 'idle',
        thermalState,
        systemMode: settings.simulationMode ? 'simulation' : 'prototype',
        lastUpdate: new Date(),
      }));
      
      // Update power history
      updatePowerHistory(newMetrics.power, newMetrics.current);
      
    }, settings.refreshRate);

    return () => clearInterval(interval);
  }, [isRunning, targetPwm, updatePowerHistory, settings.simulationMode, settings.refreshRate, fetchFromESP32]);

  const startMotor = useCallback(async () => {
    await sendToESP32(API_ENDPOINTS.control, { action: 'start' });
    setIsRunning(true);
    setStatus(prev => ({
      ...prev,
      motorState: 'running',
      alerts: prev.alerts.filter(a => a.message !== 'Motor stopped'),
    }));
  }, [sendToESP32]);

  const stopMotor = useCallback(async () => {
    await sendToESP32(API_ENDPOINTS.control, { action: 'stop' });
    setIsRunning(false);
    setTargetPwm(0);
    setStatus(prev => ({
      ...prev,
      motorState: 'idle',
    }));
  }, [sendToESP32]);

  const emergencyStop = useCallback(async () => {
    await sendToESP32(API_ENDPOINTS.control, { action: 'emergency_stop' });
    setIsRunning(false);
    setTargetPwm(0);
    setMetrics(prev => ({ ...prev, rpm: 0, pwmDuty: 0 }));
    setStatus(prev => ({
      ...prev,
      motorState: 'idle',
      alerts: [
        { id: Date.now().toString(), type: 'warning', message: 'Emergency stop activated', timestamp: new Date() },
        ...prev.alerts.slice(0, 4),
      ],
    }));
  }, [sendToESP32]);

  const handleSetTargetPwm = useCallback(async (pwm: number) => {
    const clampedPwm = Math.max(0, Math.min(100, pwm));
    await sendToESP32(API_ENDPOINTS.setSpeed, { pwm: clampedPwm });
    setTargetPwm(clampedPwm);
  }, [sendToESP32]);

  return {
    metrics,
    status,
    powerHistory,
    isRunning,
    targetPwm,
    setTargetPwm: handleSetTargetPwm,
    startMotor,
    stopMotor,
    emergencyStop,
  };
};

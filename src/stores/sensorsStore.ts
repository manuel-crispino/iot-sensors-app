// src/lib/stores/sensorsStore.ts
import { writable, derived } from 'svelte/store';

export type Sensor = {
  id: number;
  name: string;
  type: string;
  value: number;
  status: 'active' | 'inactive' ;
};

const initialSensors: Sensor[] = [
  { id: 1, name: 'Temperature', type: 'thermometer', value: 22.4, status: 'active' },
  { id: 2, name: 'Humidity', type: 'hygrometer', value: 46, status: 'active' },
  { id: 3, name: 'Pressure', type: 'barometer', value: 1012, status: 'inactive' },
  { id: 4, name: 'CO₂ Level', type: 'gas', value: 412, status: 'active' },
  { id: 5, name: 'Air Quality', type: 'aqi', value: 78, status: 'active' },
  { id: 6, name: 'Light Intensity', type: 'photometer', value: 340, status: 'active' },
  { id: 7, name: 'Sound Level', type: 'microphone', value: 55, status: 'inactive' },
  { id: 8, name: 'Motion Detector', type: 'pir', value: 1, status: 'active' },
  { id: 9, name: 'Vibration', type: 'accelerometer', value: 0.03, status: 'active' },
  { id: 10, name: 'Magnetic Field', type: 'magnetometer', value: 32, status: 'inactive' },
  { id: 11, name: 'Gyroscope', type: 'gyroscope', value: 0.2, status: 'active' },
  { id: 12, name: 'Proximity', type: 'infrared', value: 15, status: 'active' },
  { id: 13, name: 'Soil Moisture', type: 'soil', value: 68, status: 'active' },
  { id: 14, name: 'Wind Speed', type: 'anemometer', value: 12.4, status: 'inactive' },
  { id: 15, name: 'Rain Detector', type: 'rain', value: 0, status: 'active' },
  { id: 16, name: 'UV Index', type: 'uv', value: 4, status: 'active' },
  { id: 17, name: 'Battery Voltage', type: 'voltage', value: 3.7, status: 'active' },
  { id: 18, name: 'Water Flow', type: 'flow', value: 2.1, status: 'inactive' },
  { id: 19, name: 'Gas Leak', type: 'methane', value: 0, status: 'inactive' },
  { id: 20, name: 'GPS Position', type: 'gps', value: 1, status: 'active' },
  { id: 21, name: 'Smoke Level', type: 'smoke', value: 5, status: 'active' },
  { id: 22, name: 'Energy Consumption', type: 'power-meter', value: 230, status: 'active' },
  { id: 23, name: 'Door Sensor', type: 'reed-switch', value: 0, status: 'inactive' },
  { id: 24, name: 'Water Level', type: 'ultrasonic', value: 85, status: 'active' },
  { id: 25, name: 'Heart Rate', type: 'biometric', value: 78, status: 'active' },
  { id: 26, name: 'Body Temperature', type: 'biometric', value: 36.8, status: 'active' },
  { id: 27, name: 'Accelerometer X', type: 'accelerometer', value: 0.12, status: 'active' },
  { id: 28, name: 'Accelerometer Y', type: 'accelerometer', value: -0.08, status: 'active' },
  { id: 29, name: 'Accelerometer Z', type: 'accelerometer', value: 0.02, status: 'active' },
  { id: 30, name: 'Temperature (Outdoor)', type: 'thermometer', value: 17.3, status: 'inactive' }
];


export const sensors = writable(initialSensors);
export const filter = writable('');
export const sortKey = writable<'name' | 'type' | 'value' | 'status'>('name');
export const sortAsc = writable(true);

export const filteredSensors = derived(
  [sensors, filter, sortKey, sortAsc],
  ([$sensors, $filter, $sortKey, $sortAsc]) => {
    let filtered = $sensors.filter((s) =>
      s.name.toLowerCase().includes($filter.toLowerCase()) ||
      s.type.toLowerCase().includes($filter.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const v1 = a[$sortKey];
      const v2 = b[$sortKey];
      if (v1 < v2) return $sortAsc ? -1 : 1;
      if (v1 > v2) return $sortAsc ? 1 : -1;
      return 0;
    });
  }
);

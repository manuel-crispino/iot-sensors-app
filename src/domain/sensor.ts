// Tipo que describe un sensor

export interface Sensor {
  id: number;        // Identificador único
  nombre: string;    // Nombre del sensor
  tipo: string;      // Tipo (temperatura, presión, humedad, etc.)
  valor: number;     // Valor numérico actual
  estado: boolean;   // true = activo, false = inactivo
}

// Tipo que describe un sensor

export interface Sensor {
  id: number;
  nombre: string;
  tipo: string;
  valor: number;
  estado: boolean;
}
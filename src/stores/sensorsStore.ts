// 📂 src/lib/stores/sensorsStore.ts
import { writable, derived } from 'svelte/store';

/**
 * 📘 Tipo que describe un sensor
 */
export interface Sensor {
  id: number;        // Identificador único
  nombre: string;    // Nombre del sensor
  tipo: string;      // Tipo (temperatura, presión, humedad, etc.)
  valor: number;     // Valor numérico actual
  estado: boolean;   // true = activo, false = inactivo
}

/**
 * 🌱 Lista inicial de sensores
 */
export const sensoresIniciales: Sensor[] = [
  { id: 1, nombre: 'Temperatura Interior', tipo: 'temperatura', valor: 22.4, estado: true },
  { id: 2, nombre: 'Humedad Interior', tipo: 'humedad', valor: 46, estado: true },
  { id: 3, nombre: 'Presión Atmosférica', tipo: 'presión', valor: 1012.3, estado: false },
  { id: 4, nombre: 'Temperatura Exterior', tipo: 'temperatura', valor: 17.8, estado: true },
  { id: 5, nombre: 'Nivel de CO₂', tipo: 'gas', valor: 412.6, estado: true },
  { id: 6, nombre: 'Calidad del Aire', tipo: 'aire', valor: 78.2, estado: true },
  { id: 7, nombre: 'Luz Ambiental', tipo: 'luminosidad', valor: 340, estado: true },
  { id: 8, nombre: 'Nivel de Sonido', tipo: 'sonido', valor: 55.1, estado: false },
  { id: 9, nombre: 'Detector de Movimiento', tipo: 'movimiento', valor: 1, estado: true },
  { id: 10, nombre: 'Nivel de Agua', tipo: 'ultrasónico', valor: 85.4, estado: true },
  { id: 11, nombre: 'Velocidad del Viento', tipo: 'viento', valor: 12.4, estado: false },
  { id: 12, nombre: 'Índice UV', tipo: 'radiación', valor: 4.2, estado: true },
  { id: 13, nombre: 'Voltaje de Batería', tipo: 'voltaje', valor: 3.7, estado: true },
  { id: 14, nombre: 'Consumo Energético', tipo: 'electricidad', valor: 230.5, estado: true },
  { id: 15, nombre: 'Fuga de Gas', tipo: 'metano', valor: 0, estado: false },
  { id: 16, nombre: 'Sensor de Puerta', tipo: 'contacto', valor: 0, estado: false },
  { id: 17, nombre: 'Ritmo Cardíaco', tipo: 'biométrico', valor: 78, estado: true },
  { id: 18, nombre: 'Temperatura Corporal', tipo: 'biométrico', valor: 36.7, estado: true },
  { id: 19, nombre: 'Vibración', tipo: 'acelerómetro', valor: 0.03, estado: true },
  { id: 20, nombre: 'Posición GPS', tipo: 'ubicación', valor: 1, estado: true },
];

/**
 * 🧠 Store principal con todos los sensores
 */
export const sensores = writable(sensoresIniciales);

/**
 * 🔍 Store para el texto del filtro (lo que escribe el usuario)
 */
export const filtro = writable('');

/**
 * ↕️ Stores para el ordenamiento
 * criterioOrden: campo por el que se ordena
 * ordenAscendente: true = ascendente, false = descendente
 */
export const criterioOrden = writable<'id' | 'nombre' | 'tipo' | 'valor' | 'estado'>('nombre');
export const ordenAscendente = writable(true);
export const filtroTipo = writable('');   // tipo di sensor seleccionado
export const filtroEstado = writable(''); // estado (activo/inactivo)
/**
 * 🧩 Store derivado: filtra y ordena los sensores automáticamente
 */
export const sensoresFiltrados = derived(
  [sensores, filtro, filtroTipo, filtroEstado, criterioOrden, ordenAscendente],
  ([$sensores, $filtro, $filtroTipo, $filtroEstado, $criterioOrden, $ordenAscendente]) => {
    const textoFiltro = $filtro.trim().toLowerCase();

    let listaFiltrada = $sensores;

    // 🔍 Filtro por texto (nombre, tipo, etc.)
    if (textoFiltro) {
      listaFiltrada = listaFiltrada.filter((sensor) => {
        const estadoTexto = sensor.estado ? 'activo' : 'inactivo';
        return (
          sensor.nombre.toLowerCase().includes(textoFiltro) ||
          sensor.tipo.toLowerCase().includes(textoFiltro) ||
          sensor.id.toString().includes(textoFiltro) ||
          sensor.valor.toString().includes(textoFiltro) ||
          estadoTexto.includes(textoFiltro)
        );
      });
    }

    // 🧩 Filtro por tipo
    if ($filtroTipo) {
      listaFiltrada = listaFiltrada.filter((s) => s.tipo === $filtroTipo);
    }

    // ⚙️ Filtro por estado
    if ($filtroEstado) {
      const esActivo = $filtroEstado === 'activo';
      listaFiltrada = listaFiltrada.filter((s) => s.estado === esActivo);
    }

    // ↕️ Ordenamiento
    return listaFiltrada.sort((a, b) => {
      const v1 = a[$criterioOrden];
      const v2 = b[$criterioOrden];
      if (v1 < v2) return $ordenAscendente ? -1 : 1;
      if (v1 > v2) return $ordenAscendente ? 1 : -1;
      return 0;
    });
  }
);

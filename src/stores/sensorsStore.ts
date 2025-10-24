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
  { id: 20, nombre: 'Posición GPS-1', tipo: 'ubicación', valor: 1, estado: true },
  { id: 21, nombre: 'Posición GPS-2', tipo: 'ubicación', valor: 1, estado: true },
  { id: 22, nombre: 'Posición GPS-3', tipo: 'ubicación', valor: 1, estado: true },
  { id: 23, nombre: 'Posición GPS-4', tipo: 'ubicación', valor: 1, estado: true },
  { id: 24, nombre: 'Posición GPS-6', tipo: 'ubicación', valor: 1, estado: true },
  { id: 25, nombre: 'Posición GPS-7', tipo: 'ubicación', valor: 1, estado: true },
  { id: 26, nombre: 'Posición GPS-8', tipo: 'ubicación', valor: 1, estado: true },
  { id: 27, nombre: 'Posición GPS-9', tipo: 'ubicación', valor: 1, estado: true },
  { id: 28, nombre: 'Posición GPS-10', tipo: 'ubicación', valor: 1, estado: true },
  { id: 29, nombre: 'Posición GPS-11', tipo: 'ubicación', valor: 1, estado: true },
  { id: 30, nombre: 'Posición GPS-12', tipo: 'ubicación', valor: 1, estado: true },
  { id: 31, nombre: 'Posición GPS-13', tipo: 'ubicación', valor: 1, estado: true },
  { id: 32, nombre: 'Posición GPS-14', tipo: 'ubicación', valor: 1, estado: true },
  { id: 33, nombre: 'Posición GPS-15', tipo: 'ubicación', valor: 1, estado: true },
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
export const filtroNombre = writable(''); // Nombre
export const filtroId = writable(''); // id
export const filtroValor = writable(''); // value

/**
 * 🧩 Store derivado: filtra y ordena los sensores automáticamente
 */
export const sensoresFiltrados = derived(
  [sensores, filtro,filtroNombre, filtroTipo, filtroEstado,filtroId,filtroValor ,criterioOrden, ordenAscendente],
  ([$sensores, $filtro,$filtroNombre, $filtroTipo, $filtroEstado,$filtroId,$filtroValor, $criterioOrden, $ordenAscendente]) => {
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

     // 🧩 Filtro por Nombre
    if ($filtroNombre) {
      listaFiltrada = listaFiltrada.filter((s) => s.nombre === $filtroNombre);
    }


     // 🧩 Filtro por Valor
    if ($filtroValor) {
      const valorNumero = Number($filtroValor);
      listaFiltrada = listaFiltrada.filter(sensor =>
        sensor.valor === valorNumero
      );
    }
     // 🧩 Filtro por Valor
    if ($filtroId) {
      const idNumero = Number($filtroId);
      listaFiltrada = listaFiltrada.filter(sensor =>
        sensor.id === idNumero
      );
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

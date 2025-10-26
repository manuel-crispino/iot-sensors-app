//  src/lib/stores/sensorsStore.ts
import { writable, derived } from 'svelte/store';
import type {Sensor} from '$domain/sensor';

 // Store principal con todos los sensores
export const sensores = writable<Sensor[]>([]);

 // Store para el texto del filtro (lo que escribe el usuario)
export const filtro = writable('');


//  ↕️ Stores para el ordenamiento
//  criterioOrden: campo por el que se ordena
//  ordenAscendente: true = ascendente, false = descendente
 
export const filtroTipo = writable('');   // tipo di sensor seleccionado
export const filtroEstado = writable(''); // estado (activo/inactivo)
export const filtroNombre = writable(''); // Nombre
export const filtroId = writable(''); // id
export const filtroValor = writable(''); // value
export const ordenAscendente = writable<boolean>(true); // orden A-Z 
export const criterioOrden = writable<'nombre'| 'tipo'| 'valor'>('nombre') // criterio orden nombre default

 // Store derivado: filtra y ordena los sensores automáticamente
 
export const sensoresFiltrados = derived(
  [sensores, filtro,filtroNombre, filtroTipo, filtroEstado,filtroId,filtroValor,ordenAscendente,criterioOrden],
  ([$sensores, $filtro,$filtroNombre, $filtroTipo, $filtroEstado,$filtroId,$filtroValor,$ordenAscendente,$criterioOrden]) => {
    const textoFiltro = $filtro.trim().toLowerCase();

    let listaFiltrada = $sensores;

    // 🔍 Filtro por texto (nombre, tipo)
    if (textoFiltro) {
      listaFiltrada = listaFiltrada.filter((sensor) => {
        return (
          sensor.nombre.toLowerCase().includes(textoFiltro) ||
          sensor.tipo.toLowerCase().includes(textoFiltro) 
        );
      });
    }

    //  Filtro por tipo
    if ($filtroTipo) {
      listaFiltrada = listaFiltrada.filter((s) => s.tipo === $filtroTipo);
    }

     //  Filtro por Nombre
    if ($filtroNombre) {
      listaFiltrada = listaFiltrada.filter((s) => s.nombre === $filtroNombre);
    }


     //  Filtro por Valor
    if ($filtroValor) {
      const valorNumero = Number($filtroValor);
      listaFiltrada = listaFiltrada.filter(sensor =>
        sensor.valor === valorNumero
      );
    }
     // Filtro por Valor
    if ($filtroId) {
      const idNumero = Number($filtroId);
      listaFiltrada = listaFiltrada.filter(sensor =>
        sensor.id === idNumero
      );
    }

    //  Filtro por estado
    if ($filtroEstado) {
      const esActivo = $filtroEstado === 'activo';
      listaFiltrada = listaFiltrada.filter((s) => s.estado === esActivo);
    }

    if ($criterioOrden) {

      // tim sort  = O(n log n)
      listaFiltrada = [...listaFiltrada].sort((a, b) => 
      {
        const valorA = a[$criterioOrden];
        const valorB = b[$criterioOrden];

        if (typeof valorA === 'string' && typeof valorB === 'string') {
          return $ordenAscendente
            ? valorA.localeCompare(valorB)
            : valorB.localeCompare(valorA);
        } 
        else 
        {
          return $ordenAscendente
            ? Number(valorA) - Number(valorB)
            : Number(valorB) - Number(valorA);
        }
      });
    }

    // ️ Ordenamiento
    return listaFiltrada;
  }
);

import type { Tarea } from '../types/Tarea'

type NuevaTarea = Pick<Tarea, 'titulo' | 'responsable'>
export type CambiosTarea = Partial<Pick<Tarea, 'titulo' | 'responsable' | 'completada'>>

const apiUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

const esObjeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null

const esTarea = (valor: unknown): valor is Tarea =>
  esObjeto(valor) &&
  typeof valor.id === 'string' &&
  typeof valor.titulo === 'string' &&
  typeof valor.responsable === 'string' &&
  typeof valor.completada === 'boolean'

const esListaDeTareas = (valor: unknown): valor is Tarea[] =>
  Array.isArray(valor) && valor.every(esTarea)

const esResultadoEliminacion = (valor: unknown): boolean =>
  esObjeto(valor) && typeof valor.message === 'string' && esTarea(valor.tarea)

async function solicitar<T>(
  url: string,
  opciones: RequestInit,
  mensajePredeterminado: string,
  validar: (valor: unknown) => valor is T,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${apiUrl}${url}`, opciones)
  } catch {
    throw new Error('No se pudo conectar con el servidor. Inténtalo de nuevo.')
  }

  const resultado: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const mensaje =
      typeof resultado === 'object' && resultado !== null && 'error' in resultado &&
      typeof resultado.error === 'string'
        ? resultado.error
        : mensajePredeterminado
    throw new Error(mensaje)
  }

  if (!validar(resultado)) {
    throw new Error('El servidor devolvió una respuesta con formato inesperado.')
  }

  return resultado
}

export function obtenerTareas(): Promise<Tarea[]> {
  return solicitar('/api/tareas', {}, 'No se pudieron cargar las tareas.', esListaDeTareas)
}

export function crearTarea(datos: NuevaTarea): Promise<Tarea> {
  return solicitar<Tarea>(
    '/api/tareas',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    },
    'No se pudo registrar la tarea. Inténtalo de nuevo.',
    esTarea,
  )
}

export function actualizarTarea(id: string, cambios: CambiosTarea): Promise<Tarea> {
  return solicitar<Tarea>(
    `/api/tareas/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios),
    },
    'No se pudo actualizar la tarea.',
    esTarea,
  )
}

export async function eliminarTarea(id: string): Promise<void> {
  await solicitar<unknown>(
    `/api/tareas/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
    'No se pudo eliminar la tarea.',
    (resultado): resultado is unknown => esResultadoEliminacion(resultado),
  )
}
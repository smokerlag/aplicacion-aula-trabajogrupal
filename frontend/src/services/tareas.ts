import type { Tarea } from '../types/Tarea'

type NuevaTarea = Pick<Tarea, 'titulo' | 'responsable'>
export type CambiosTarea = Partial<Pick<Tarea, 'titulo' | 'responsable' | 'completada'>>

async function solicitar<T>(
  url: string,
  opciones: RequestInit,
  mensajePredeterminado: string,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, opciones)
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

  return resultado as T
}

export function obtenerTareas(): Promise<Tarea[]> {
  return solicitar<Tarea[]>('/api/tareas', {}, 'No se pudieron cargar las tareas.')
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
  )
}

export async function eliminarTarea(id: string): Promise<void> {
  await solicitar<unknown>(
    `/api/tareas/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
    'No se pudo eliminar la tarea.',
  )
}
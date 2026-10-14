import type {
  ActualizacionTarea,
  NuevaTarea,
  ResultadoEliminacionTarea,
  Tarea,
} from '../types/task'

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)

export class ApiError extends Error {
  readonly status?: number

  constructor(
    message: string,
    status?: number,
    options?: ErrorOptions,
  ) {
    super(message, options)
    this.name = 'ApiError'
    this.status = status
  }
}

const esObjeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null

const esTarea = (valor: unknown): valor is Tarea =>
  esObjeto(valor) &&
  typeof valor.id === 'string' &&
  typeof valor.titulo === 'string' &&
  typeof valor.responsable === 'string' &&
  typeof valor.completada === 'boolean'

const esResultadoEliminacion = (
  valor: unknown,
): valor is ResultadoEliminacionTarea =>
  esObjeto(valor) && typeof valor.message === 'string' && esTarea(valor.tarea)

const mensajeErrorHttp = (payload: unknown, status: number): string => {
  if (esObjeto(payload)) {
    if (typeof payload.error === 'string') return payload.error
    if (typeof payload.message === 'string') return payload.message
  }

  return `La API respondió con el estado HTTP ${status}.`
}

async function solicitarJson<T>(
  ruta: string,
  init: RequestInit,
  validar: (valor: unknown) => valor is T,
): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${apiUrl}${ruta}`, init)
  } catch (error) {
    throw new ApiError('No se pudo conectar con el servidor de tareas.', undefined, {
      cause: error,
    })
  }

  const texto = await response.text()
  let payload: unknown

  try {
    payload = JSON.parse(texto)
  } catch (error) {
    if (!response.ok) {
      throw new ApiError(
        `La API respondió con el estado HTTP ${response.status} y un cuerpo no válido.`,
        response.status,
        { cause: error },
      )
    }

    throw new ApiError('La API devolvió una respuesta que no es JSON.', response.status, {
      cause: error,
    })
  }

  if (!response.ok) {
    throw new ApiError(mensajeErrorHttp(payload, response.status), response.status)
  }

  if (!validar(payload)) {
    throw new ApiError('La API devolvió datos con un formato inesperado.', response.status)
  }

  return payload
}

const jsonRequest = (method: 'POST' | 'PATCH', body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export function listarTareas(): Promise<Tarea[]> {
  return solicitarJson('/api/tareas', {}, (valor): valor is Tarea[] =>
    Array.isArray(valor) && valor.every(esTarea),
  )
}

export function crearTarea(datos: NuevaTarea): Promise<Tarea> {
  return solicitarJson('/api/tareas', jsonRequest('POST', datos), esTarea)
}

export function actualizarTarea(
  id: string,
  cambios: ActualizacionTarea,
): Promise<Tarea> {
  return solicitarJson(
    `/api/tareas/${encodeURIComponent(id)}`,
    jsonRequest('PATCH', cambios),
    esTarea,
  )
}

export function eliminarTarea(id: string): Promise<ResultadoEliminacionTarea> {
  return solicitarJson(
    `/api/tareas/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
    esResultadoEliminacion,
  )
}
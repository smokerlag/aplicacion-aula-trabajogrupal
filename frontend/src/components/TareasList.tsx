import { useEffect, useState, type FormEvent } from 'react'
import { actualizarTarea, eliminarTarea, obtenerTareas } from '../services/tareas'
import type { CambiosTarea } from '../services/tareas'
import type { Tarea } from '../types/Tarea'

type TareasListProps = {
  refreshKey: number
}

type TareaRowProps = {
  tarea: Tarea
  onActualizar: (id: string, cambios: CambiosTarea) => Promise<Tarea>
  onEliminar: (id: string) => Promise<void>
}

function TareaRow({ tarea, onActualizar, onEliminar }: TareaRowProps) {
  const [editando, setEditando] = useState(false)
  const [titulo, setTitulo] = useState(tarea.titulo)
  const [responsable, setResponsable] = useState(tarea.responsable)
  const [ocupada, setOcupada] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  async function ejecutar(accion: () => Promise<void>, mensajeExito: string) {
    setOcupada(true)
    setError('')
    setMensaje('')
    try {
      await accion()
      setMensaje(mensajeExito)
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : 'No se pudo actualizar la tarea.')
    } finally {
      setOcupada(false)
    }
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const tituloLimpio = titulo.trim()
    const responsableLimpio = responsable.trim()
    if (!tituloLimpio || !responsableLimpio) {
      setError('El título y el responsable son obligatorios.')
      return
    }

    await ejecutar(async () => {
      await onActualizar(tarea.id, { titulo: tituloLimpio, responsable: responsableLimpio })
      setEditando(false)
    }, 'Cambios guardados.')
  }

  function confirmarEliminacion() {
    if (ocupada || !window.confirm(`¿Eliminar "${tarea.titulo}"? Esta acción no se puede deshacer.`)) {
      return
    }
    void ejecutar(() => onEliminar(tarea.id), 'Tarea eliminada.')
  }

  if (editando) {
    return (
      <li className="task-row editing">
        <form className="task-edit-form" onSubmit={guardar}>
          <div className="edit-fields">
            <label>
              <span>Título</span>
              <input value={titulo} onChange={(event) => setTitulo(event.target.value)} disabled={ocupada} />
            </label>
            <label>
              <span>Responsable</span>
              <input value={responsable} onChange={(event) => setResponsable(event.target.value)} disabled={ocupada} />
            </label>
          </div>
          {error && <p className="row-error" role="alert">{error}</p>}
          <div className="task-actions">
            <button className="text-button" type="button" onClick={() => { setEditando(false); setError('') }} disabled={ocupada}>
              Cancelar
            </button>
            <button className="text-button primary-action" type="submit" disabled={ocupada}>
              {ocupada ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className={`task-row${tarea.completada ? ' completed' : ''}`}>
      <div className="task-description">
        <p className="task-title">{tarea.titulo}</p>
        <p className="task-assignee">Responsable: {tarea.responsable}</p>
      </div>
      <label className="completion-toggle">
        <input
          type="checkbox"
          checked={tarea.completada}
          disabled={ocupada}
          onChange={() => void ejecutar(
            async () => { await onActualizar(tarea.id, { completada: !tarea.completada }) },
            tarea.completada ? 'Tarea marcada como pendiente.' : 'Tarea completada.',
          )}
          aria-label={tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
        />
        <span>{tarea.completada ? 'Completada' : 'Pendiente'}</span>
      </label>
      <div className="task-actions">
        <button className="text-button" type="button" onClick={() => { setEditando(true); setError(''); setTitulo(tarea.titulo); setResponsable(tarea.responsable) }} disabled={ocupada}>
          Editar
        </button>
        <button className="text-button delete-action" type="button" onClick={confirmarEliminacion} disabled={ocupada}>
          Eliminar
        </button>
      </div>
      {(error || mensaje) && <p className={`row-feedback${error ? ' row-error' : ''}`} role={error ? 'alert' : 'status'}>{error || mensaje}</p>}
    </li>
  )
}

function TareasList({ refreshKey }: TareasListProps) {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let activa = true

    obtenerTareas()
      .then((resultado) => {
        if (activa) {
          setTareas(resultado)
          setError('')
        }
      })
      .catch((fallo: unknown) => {
        if (activa) setError(fallo instanceof Error ? fallo.message : 'No se pudieron cargar las tareas.')
      })
      .finally(() => {
        if (activa) setCargando(false)
      })

    return () => { activa = false }
  }, [refreshKey, retryKey])

  async function actualizar(id: string, cambios: CambiosTarea): Promise<Tarea> {
    const tareaActualizada = await actualizarTarea(id, cambios)
    setTareas((actuales) => actuales.map((tarea) => tarea.id === id ? tareaActualizada : tarea))
    return tareaActualizada
  }

  async function eliminar(id: string): Promise<void> {
    await eliminarTarea(id)
    setTareas((actuales) => actuales.filter((tarea) => tarea.id !== id))
  }

  return (
    <section className="task-list-section" aria-labelledby="tasks-heading" aria-busy={cargando}>
      <div className="task-list-heading">
        <div>
          <p className="eyebrow">SEGUIMIENTO</p>
          <h2 id="tasks-heading">Tareas registradas</h2>
        </div>
        {!cargando && !error && <span className="task-count">{tareas.length} {tareas.length === 1 ? 'tarea' : 'tareas'}</span>}
      </div>

      {cargando && <p className="list-message" role="status">Cargando tareas…</p>}
      {!cargando && error && (
        <div className="list-error" role="alert">
          <p>{error}</p>
          <button className="text-button primary-action" type="button" onClick={() => { setCargando(true); setError(''); setRetryKey((actual) => actual + 1) }}>
            Reintentar
          </button>
        </div>
      )}
      {!cargando && !error && tareas.length === 0 && (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">+</span>
          <h3>Aún no hay tareas</h3>
          <p>Las actividades que registres aparecerán aquí.</p>
        </div>
      )}
      {!cargando && !error && tareas.length > 0 && (
        <ul className="task-list">
          {tareas.map((tarea) => (
            <TareaRow key={tarea.id} tarea={tarea} onActualizar={actualizar} onEliminar={eliminar} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default TareasList
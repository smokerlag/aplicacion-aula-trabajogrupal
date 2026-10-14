import { useState, type FormEvent } from 'react'
import { crearTarea } from '../services/tareas'
import type { Tarea } from '../types/Tarea'

type ErroresFormulario = {
  titulo?: string
  responsable?: string
}

type TareaFormProps = {
  onTareaCreada: (tarea: Tarea) => void
}

function TareaForm({ onTareaCreada }: TareaFormProps) {
  const [titulo, setTitulo] = useState('')
  const [responsable, setResponsable] = useState('')
  const [errores, setErrores] = useState<ErroresFormulario>({})
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState<'exito' | 'error' | ''>('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMensaje('')
    setTipoMensaje('')

    const nuevosErrores: ErroresFormulario = {}
    if (!titulo.trim()) nuevosErrores.titulo = 'Escribe un título para la tarea.'
    if (!responsable.trim()) nuevosErrores.responsable = 'Indica quién será responsable.'

    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setEnviando(true)
    try {
      const tarea = await crearTarea({ titulo: titulo.trim(), responsable: responsable.trim() })
      onTareaCreada(tarea)
      setTitulo('')
      setResponsable('')
      setErrores({})
      setTipoMensaje('exito')
      setMensaje('Tarea registrada correctamente.')
    } catch (error) {
      setTipoMensaje('error')
      setMensaje(error instanceof Error ? error.message : 'Ocurrió un error al registrar la tarea.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <div>
          <p className="form-kicker">NUEVA ACTIVIDAD</p>
          <h2>Crear tarea</h2>
        </div>
        <span className="required-note"><span aria-hidden="true">*</span> Obligatorio</span>
      </div>

      <div className="field-group">
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          autoComplete="off"
          placeholder="Ej. Preparar exposición de historia"
          value={titulo}
          onChange={(event) => {
            setTitulo(event.target.value)
            setErrores((actuales) => ({ ...actuales, titulo: undefined }))
            setMensaje('')
          }}
          aria-invalid={Boolean(errores.titulo)}
          aria-describedby={errores.titulo ? 'titulo-error' : undefined}
          disabled={enviando}
        />
        {errores.titulo && <p className="field-error" id="titulo-error">{errores.titulo}</p>}
      </div>

      <div className="field-group">
        <label htmlFor="responsable">Responsable</label>
        <input
          id="responsable"
          name="responsable"
          type="text"
          required
          autoComplete="name"
          placeholder="Nombre de la persona responsable"
          value={responsable}
          onChange={(event) => {
            setResponsable(event.target.value)
            setErrores((actuales) => ({ ...actuales, responsable: undefined }))
            setMensaje('')
          }}
          aria-invalid={Boolean(errores.responsable)}
          aria-describedby={errores.responsable ? 'responsable-error' : undefined}
          disabled={enviando}
        />
        {errores.responsable && <p className="field-error" id="responsable-error">{errores.responsable}</p>}
      </div>

      <button className="submit-button" type="submit" disabled={enviando}>
        <span>{enviando ? 'Registrando…' : 'Registrar tarea'}</span>
        <span aria-hidden="true">{enviando ? '···' : '↗'}</span>
      </button>

      <p className={`form-message ${tipoMensaje}`} role="status" aria-live="polite">
        {mensaje}
      </p>
    </form>
  )
}

export default TareaForm
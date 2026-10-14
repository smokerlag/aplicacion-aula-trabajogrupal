export interface Tarea {
  id: string
  titulo: string
  responsable: string
  completada: boolean
}

export type NuevaTarea = Pick<Tarea, 'titulo' | 'responsable'> &
  Partial<Pick<Tarea, 'completada'>>

export type ActualizacionTarea = Partial<
  Pick<Tarea, 'titulo' | 'responsable' | 'completada'>
>

export interface ResultadoEliminacionTarea {
  message: string
  tarea: Tarea
}
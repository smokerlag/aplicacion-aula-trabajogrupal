# 📚 Gestor de Tareas Académicas

Aplicación web sencilla para organizar y administrar tareas académicas de un aula. El proyecto tiene como finalidad desarrollar una aplicación funcional y demostrar el uso de Git y GitHub para el control de versiones, la colaboración y la revisión de cambios en equipo.

## 🎯 Objetivo del proyecto

Desarrollar un gestor de tareas que permita registrar, visualizar y administrar actividades académicas, aplicando buenas prácticas de trabajo colaborativo mediante ramas, commits, pull requests y revisión de código.

## ✨ Funcionalidades

- **Registrar tareas:** agregar tareas con título y responsable.
- **Listar tareas:** visualizar las tareas registradas.
- **Completar tareas:** marcar las actividades que ya se realizaron.
- **Eliminar tareas:** retirar tareas de la lista.
- **Gestión sencilla:** utilizar una interfaz web para organizar las actividades académicas.

> La persistencia de datos es opcional. Si no se implementa, las tareas se mantendrán en memoria y podrán perderse al recargar la página.

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript
- Git
- GitHub

## 🚀 Instalación y ejecución

1. Clonar el repositorio:

   ```bash
   git clone URL_DEL_REPOSITORIO
   ```

2. Ingresar a la carpeta del proyecto:

   ```bash
   cd NOMBRE_DEL_REPOSITORIO
   ```

3. Abrir el archivo `index.html` en un navegador web.

   También se puede utilizar la extensión **Live Server** de Visual Studio Code para ejecutar la aplicación durante el desarrollo.

## 🌿 Flujo de trabajo con Git y GitHub

Durante el desarrollo se utilizará un flujo de trabajo colaborativo que incluye:

1. Crear una rama propia para cada integrante.
2. Implementar funcionalidades mediante cambios significativos.
3. Registrar los avances con commits descriptivos.
4. Subir las ramas al repositorio remoto.
5. Crear pull requests para integrar los cambios.
6. Revisar el código de otros integrantes antes de aprobar los cambios.
7. Resolver conflictos de integración cuando sea necesario.
8. Integrar los cambios aprobados en la rama principal.

## 👥 Organización del equipo

El equipo distribuirá las responsabilidades entre los siguientes roles:

- **Coordinación:** organizar las actividades y supervisar el avance.
- **Desarrollo:** implementar y mejorar las funcionalidades.
- **Revisión:** analizar los cambios y verificar su integración.

Cada integrante deberá realizar aportes verificables, trabajar en una rama propia y participar en la revisión de pull requests.

## 🧪 Pruebas y automatización

Se realizarán verificaciones para comprobar el funcionamiento de las funcionalidades principales:

- Registro de tareas.
- Visualización de la lista.
- Marcado de tareas como completadas.
- Eliminación de tareas.

Asimismo, se incorporará una ejecución de automatización como evidencia del proceso de validación del proyecto.

## 📋 Resultados esperados

- Aplicación web funcional.
- Repositorio con historial de commits verificable.
- Ramas de trabajo por integrante.
- Pull requests revisados.
- Resolución documentada de un conflicto.
- Tablero de tareas para organizar el trabajo.
- Ejecución de automatización.
- Informe con capturas y explicaciones del proceso.

## � API REST del gestor académico

El backend expone la API REST para gestionar tareas académicas con almacenamiento en memoria.

### Endpoints disponibles

- `GET /api/health` — verifica que el servidor está activo.
- `GET /api/tareas` — devuelve la lista completa de tareas.
- `POST /api/tareas` — crea una nueva tarea. Requiere `titulo` y `responsable` no vacíos.
- `PATCH /api/tareas/:id` — actualiza los campos permitidos de una tarea existente.
- `DELETE /api/tareas/:id` — elimina una tarea por su `id`.

### Ejemplo de payload

```json
{
  "titulo": "Investigación de lectura",
  "responsable": "Ana",
  "completada": false
}
```

### Respuestas esperadas

- `200 OK` para consultas y actualizaciones exitosas.
- `201 Created` cuando se registra una tarea.
- `400 Bad Request` cuando faltan datos o son inválidos.
- `404 Not Found` cuando la tarea no existe.

## �📄 Licencia

Este proyecto utiliza la licencia [MIT](LICENSE), que permite utilizar, modificar y distribuir el software de acuerdo con las condiciones establecidas en dicha licencia.

## 🎓 Contexto académico

Proyecto desarrollado con fines educativos para practicar el control de versiones, la colaboración en equipo y la gestión de código fuente mediante Git y GitHub.

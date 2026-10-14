
import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { pathToFileURL } from "node:url";

type Tarea = {
  id: string;
  titulo: string;
  responsable: string;
  completada: boolean;
};

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const tareas: Tarea[] = [];

const enviarError = (res: express.Response, status: number, mensaje: string) => {
  return res.status(status).json({ error: mensaje });
};

const normalizarTexto = (valor: unknown): string => {
  return typeof valor === "string" ? valor.trim() : "";
};

const validarTexto = (valor: unknown): boolean => {
  return normalizarTexto(valor).length > 0;
};

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "API de tareas académicas activa.",
    endpoints: [
      "GET /api/health",
      "GET /api/tareas",
      "POST /api/tareas",
      "PATCH /api/tareas/:id",
      "DELETE /api/tareas/:id",
    ],
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "El servidor funciona correctamente",
  });
});

app.get("/api/tareas", (_req, res) => {
  res.status(200).json(tareas);
});

app.post("/api/tareas", (req, res) => {
  const { titulo, responsable, completada = false } = req.body ?? {};

  if (!validarTexto(titulo)) {
    return enviarError(res, 400, "El título es obligatorio.");
  }

  if (!validarTexto(responsable)) {
    return enviarError(res, 400, "El responsable es obligatorio.");
  }

  if (typeof completada !== "boolean") {
    return enviarError(res, 400, "El campo completada debe ser un valor booleano.");
  }

  const nuevaTarea: Tarea = {
    id: randomUUID(),
    titulo: normalizarTexto(titulo),
    responsable: normalizarTexto(responsable),
    completada,
  };

  tareas.push(nuevaTarea);
  return res.status(201).json(nuevaTarea);
});

app.patch("/api/tareas/:id", (req, res) => {
  const { id } = req.params;
  const tarea = tareas.find((item) => item.id === id);

  if (!tarea) {
    return enviarError(res, 404, "La tarea no existe.");
  }

  const { titulo, responsable, completada } = req.body ?? {};

  if (titulo !== undefined && !validarTexto(titulo)) {
    return enviarError(res, 400, "El título no puede estar vacío.");
  }

  if (responsable !== undefined && !validarTexto(responsable)) {
    return enviarError(res, 400, "El responsable no puede estar vacío.");
  }

  if (completada !== undefined && typeof completada !== "boolean") {
    return enviarError(res, 400, "El campo completada debe ser un valor booleano.");
  }

  if (titulo !== undefined) {
    tarea.titulo = normalizarTexto(titulo);
  }

  if (responsable !== undefined) {
    tarea.responsable = normalizarTexto(responsable);
  }

  if (completada !== undefined) {
    tarea.completada = completada;
  }

  return res.status(200).json(tarea);
});

app.delete("/api/tareas/:id", (req, res) => {
  const { id } = req.params;
  const indice = tareas.findIndex((item) => item.id === id);

  if (indice === -1) {
    return enviarError(res, 404, "La tarea no existe.");
  }

  const [eliminada] = tareas.splice(indice, 1);
  return res.status(200).json({
    message: "Tarea eliminada correctamente.",
    tarea: eliminada,
  });
});

export { app };

export function startServer(port = PORT) {
  return app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
  });
}

const isMainModule =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  startServer();
}

import test from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/server.js";

async function request(path: string, init?: RequestInit) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("No se pudo obtener el puerto del servidor de pruebas");
  }

  const response = await fetch(`http://127.0.0.1:${address.port}${path}`, init);
  const body = await response.text();

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve(undefined);
    });
  });

  return {
    response,
    body,
  };
}

test("GET /api/health devuelve estado ok", async () => {
  const { response, body } = await request("/api/health");

  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(body), {
    status: "ok",
    message: "El servidor funciona correctamente",
  });
});

test("POST /api/tareas crea una tarea con datos válidos", async () => {
  const { response, body } = await request("/api/tareas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: "Tarea de prueba",
      responsable: "Ana",
      completada: false,
    }),
  });

  assert.equal(response.status, 201);
  const payload = JSON.parse(body);
  assert.equal(payload.titulo, "Tarea de prueba");
  assert.equal(payload.responsable, "Ana");
  assert.equal(payload.completada, false);
  assert.equal(typeof payload.id, "string");
});

test("PATCH /api/tareas/:id actualiza una tarea existente", async () => {
  const createResponse = await request("/api/tareas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: "Tarea inicial",
      responsable: "Beto",
      completada: false,
    }),
  });

  const created = JSON.parse(createResponse.body);

  const { response, body } = await request(`/api/tareas/${created.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: "Tarea actualizada",
      completada: true,
    }),
  });

  assert.equal(response.status, 200);
  const payload = JSON.parse(body);
  assert.equal(payload.titulo, "Tarea actualizada");
  assert.equal(payload.completada, true);
  assert.equal(payload.responsable, "Beto");
});

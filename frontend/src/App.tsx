import { useState } from 'react'
import TareasList from './components/TareasList'
import TareaForm from './components/TareaForm'
import './App.css'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Aula, inicio">
          <span className="wordmark-mark" aria-hidden="true">A</span>
          <span>Aula</span>
        </a>
        <span className="topbar-label">Organización académica</span>
      </header>

      <section className="workspace" aria-labelledby="page-title">
        <div className="page-intro">
          <p className="eyebrow">ESPACIO DE TRABAJO <span> / </span> TAREAS</p>
          <h1 id="page-title">Una idea,<br />un siguiente paso.</h1>
          <p className="intro-copy">
            Registra una actividad y asígnale a la persona que la llevará adelante.
          </p>
        </div>
        <TareaForm onTareaCreada={() => setRefreshKey((actual) => actual + 1)} />
      </section>

      <TareasList refreshKey={refreshKey} />

      <footer className="page-footer">
        <span>Hecho para avanzar en equipo.</span>
        <span className="footer-status"><span aria-hidden="true" /> Aula académica</span>
      </footer>
    </main>
  )
}

export default App

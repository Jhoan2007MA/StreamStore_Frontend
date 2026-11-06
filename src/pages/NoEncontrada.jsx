import { Link } from "react-router-dom"

export default function NoEncontrada() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="titulo-display text-8xl text-brand">404</p>
      <h1 className="mt-6 titulo-display text-3xl">Página no encontrada</h1>
      <Link to="/" className="mt-6 inline-block boton-primario">Volver al inicio</Link>
    </div>
  )
}

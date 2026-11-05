import { Link } from "react-router-dom"

export default function NoEncontrada() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold">Página no encontrada</h1>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 font-semibold hover:bg-brand-dark">Volver al inicio</Link>
    </div>
  )
}

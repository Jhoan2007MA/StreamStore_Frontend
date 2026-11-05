import { Hammer } from "lucide-react"

// Página temporal para las secciones que construiremos en las siguientes fases
export default function EnConstruccion({ titulo }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <Hammer size={44} className="mx-auto text-brand" />
      <h1 className="mt-4 text-2xl font-bold">{titulo}</h1>
      <p className="mt-2 text-zinc-400">Esta sección está en construcción.</p>
    </div>
  )
}

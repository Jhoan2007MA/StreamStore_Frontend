export default function Cargando({ texto = "Cargando..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-zinc-400">
      <span className="size-5 animate-spin rounded-full border-2 border-zinc-600 border-t-brand" />
      {texto}
    </div>
  )
}

// Caja de mensaje. tipo: "error" | "exito" | "info"
const ESTILOS = {
  error: "border-red-500/40 bg-red-500/10 text-red-200",
  exito: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  info: "border-brand/40 bg-brand/10 text-violet-200"
}

export default function Aviso({ tipo = "info", children }) {
  if (!children) return null
  return <div className={`rounded-lg border px-4 py-3 text-sm ${ESTILOS[tipo]}`}>{children}</div>
}

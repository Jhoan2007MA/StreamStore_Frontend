// Botones Anterior / Siguiente para los listados paginados del backend
export default function Paginacion({ resultado, onCambiar }) {
  if (!resultado || resultado.totalPages <= 1) return null

  return (
    <div className="mt-6 flex items-center justify-center gap-4 text-sm">
      <button onClick={() => onCambiar(resultado.previousPage)} disabled={!resultado.previousPage} className="boton-secundario px-5 py-2 text-xs">
        Anterior
      </button>
      <span className="text-zinc-400">Página {resultado.currentPage} de {resultado.totalPages}</span>
      <button onClick={() => onCambiar(resultado.nextPage)} disabled={!resultado.nextPage} className="boton-secundario px-5 py-2 text-xs">
        Siguiente
      </button>
    </div>
  )
}

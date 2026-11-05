// Piezas reutilizables para los formularios (login, registro, admin...)

export function TarjetaFormulario({ titulo, subtitulo, children }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-borde bg-panel p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-zinc-400">{subtitulo}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

// Un input con su etiqueta y, si hay, el mensaje de error debajo
export function CampoTexto({ etiqueta, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-zinc-300">{etiqueta}</span>
      <input
        {...props}
        className={`w-full rounded-lg border bg-fondo px-3 py-2.5 outline-none transition focus:border-brand ${error ? "border-red-500" : "border-borde"}`}
      />
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  )
}

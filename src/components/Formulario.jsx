// Piezas reutilizables para los formularios (login, registro, admin...)

export function TarjetaFormulario({ titulo, subtitulo, children }) {
  return (
    <div className="contenedor flex justify-center py-16 sm:py-24">
      <div className="superficie w-full max-w-md animate-aparecer p-8 sm:p-10">
        <p className="etiqueta">SH Vision</p>
        <h1 className="titulo-display mt-4 text-4xl">{titulo}</h1>
        {subtitulo && <p className="mt-3 text-sm leading-relaxed text-suave">{subtitulo}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}

// Un campo con su etiqueta y, si hay, el mensaje de error debajo
export function CampoTexto({ etiqueta, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-zinc-500">{etiqueta}</span>
      <input {...props} aria-invalid={Boolean(error)} className={`campo ${error ? "border-red-500/60" : ""}`} />
      {error && <span className="mt-1.5 block text-xs text-red-300">{error}</span>}
    </label>
  )
}

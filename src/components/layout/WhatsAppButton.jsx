import { MessageCircle, X } from "lucide-react"
import { useEffect, useState } from "react"

// Botón flotante de WhatsApp: vidrio oscuro con ícono verde, un halo que late,
// un punto de "en línea" que parpadea y, cada 30 s, una burbuja con un mensaje.
// El número va en .env (VITE_WHATSAPP)
const numero = import.meta.env.VITE_WHATSAPP ?? "573001234567"
const enlace = (texto) => `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`

const MENSAJES = [
  "¿Necesitas ayuda? Escríbenos 👋",
  "¿Qué plataforma te gustaría tener hoy?",
  "¿Dudas con tu pantalla o cuenta? Te ayudamos.",
  "Te asesoramos para elegir el mejor plan 🎬",
  "¿Buscas un combo? Pregúntanos por descuentos.",
]

const CADA = 30_000 // cada cuánto aparece una burbuja
const DURA = 7_000 // cuánto tiempo se queda visible

export default function WhatsAppButton() {
  const [indice, setIndice] = useState(0)
  const [visible, setVisible] = useState(false)
  const [descartado, setDescartado] = useState(false)

  useEffect(() => {
    if (descartado) return
    let ocultar
    const intervalo = setInterval(() => {
      setVisible(true)
      ocultar = setTimeout(() => {
        setVisible(false)
        setIndice((i) => (i + 1) % MENSAJES.length) // el siguiente mensaje será otro
      }, DURA)
    }, CADA)
    return () => {
      clearInterval(intervalo)
      clearTimeout(ocultar)
    }
  }, [descartado])

  const mensaje = MENSAJES[indice]

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
      {/* Burbuja de mensaje: al tocarla abre WhatsApp con ese texto. Se puede cerrar con la X */}
      {visible && !descartado && (
        <div className="relative max-w-[260px] animate-burbuja" role="status">
          <a
            href={enlace(`Hola, vi el mensaje "${mensaje}" en SH Vision y quiero información`)}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl rounded-br-sm border border-white/10 bg-fondo/80 py-3 pl-4 pr-9 text-sm leading-snug text-tinta shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition hover:border-emerald-400/40"
          >
            <span className="mb-1 block text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-emerald-400">
              Asesor en línea
            </span>
            {mensaje}
          </a>
          <button
            onClick={() => setDescartado(true)}
            aria-label="No mostrar más mensajes"
            className="absolute right-2 top-2 grid size-6 place-items-center rounded-full text-suave transition hover:bg-white/10 hover:text-tinta"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>
      )}

      <a
        href={enlace("Hola, quiero información sobre SH Vision")}
        target="_blank"
        rel="noreferrer"
        aria-label="Hablar con un asesor por WhatsApp"
        className="group relative flex items-center gap-3 rounded-full border border-emerald-400/30 bg-fondo/70 p-3.5 text-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.25),0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-500 ease-lujo hover:border-emerald-400/60 hover:shadow-[0_0_32px_rgba(52,211,153,0.45),0_10px_30px_rgba(0,0,0,0.5)]"
      >
        {/* Halo verde que se expande y desvanece, como un latido */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 animate-halo rounded-full border border-emerald-400/60" />
        <span className="relative">
          <MessageCircle size={22} strokeWidth={1.5} />
          {/* Punto "en línea" que parpadea */}
          <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 size-2.5 animate-parpadeo rounded-full border-2 border-fondo bg-emerald-400" />
        </span>
        {/* El texto se despliega al pasar el mouse (solo en pantallas grandes) */}
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm text-tinta transition-all duration-700 ease-lujo group-hover:max-w-40 group-hover:pr-1 md:inline">
          Hablar con un asesor
        </span>
      </a>
    </div>
  )
}

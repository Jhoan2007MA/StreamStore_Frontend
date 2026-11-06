import { MessageCircle } from "lucide-react"

// Botón flotante de WhatsApp. Discreto: vidrio oscuro con el ícono verde,
// para que no compita con el contenido. El número va en .env (VITE_WHATSAPP)
const numero = import.meta.env.VITE_WHATSAPP ?? "573001234567"
const texto = encodeURIComponent("Hola, quiero información sobre SH Vision")

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${numero}?text=${texto}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Hablar con un asesor por WhatsApp"
      className="group fixed bottom-6 right-6 z-30 flex items-center gap-3 rounded-full border border-white/10 bg-fondo/70 p-3.5 text-emerald-400 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-500 ease-lujo hover:border-emerald-400/40"
    >
      <MessageCircle size={22} strokeWidth={1.5} />
      {/* El texto se despliega al pasar el mouse (solo en pantallas grandes) */}
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm text-tinta transition-all duration-700 ease-lujo group-hover:max-w-40 group-hover:pr-1 md:inline">
        Hablar con un asesor
      </span>
    </a>
  )
}

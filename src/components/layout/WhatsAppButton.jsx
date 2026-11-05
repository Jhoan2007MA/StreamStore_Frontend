import { MessageCircle } from "lucide-react"

// Botón flotante. El número se configura en el archivo .env (VITE_WHATSAPP)
const numero = import.meta.env.VITE_WHATSAPP ?? "573001234567"
const texto = encodeURIComponent("Hola, quiero información sobre StreamStore")

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${numero}?text=${texto}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 transition hover:scale-105"
    >
      <MessageCircle size={26} />
    </a>
  )
}

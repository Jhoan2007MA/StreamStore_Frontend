import { Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import ControlScroll from "./ControlScroll"
import Footer from "./Footer"
import Header from "./Header"
import WhatsAppButton from "./WhatsAppButton"

// Marco común de todas las páginas. <Outlet /> es el hueco donde se pinta la página actual.
export default function Layout() {
  const { pathname } = useLocation()
  const { esAdmin } = useAuth()
  const esInicio = pathname === "/"

  return (
    <div className="flex min-h-screen flex-col">
      {/* Fondo de toda la app: la imagen fija, muy oscurecida, para dar textura sin distraer.
          En la portada la imagen se ve completa dentro del hero. */}
      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/fondo.jpg')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-fondo/85 via-fondo/95 to-fondo" />
      </div>

      <ControlScroll />
      <Header />
      {/* El encabezado es fijo (mide 80px): en las páginas internas dejamos ese espacio arriba.
          En la portada no, porque el hero va por debajo del encabezado transparente. */}
      <main className={`flex-1 ${esInicio ? "" : "pt-20"}`}>
        <Outlet />
      </main>
      <Footer />
      {/* El asesor de WhatsApp es para compradores, no para el admin */}
      {!esAdmin && <WhatsAppButton />}
    </div>
  )
}

import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import Header from "./Header"
import WhatsAppButton from "./WhatsAppButton"

// Marco común de todas las páginas. <Outlet /> es el hueco donde se pinta la página actual.
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

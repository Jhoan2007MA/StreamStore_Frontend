import { Route, Routes } from "react-router-dom"
import Layout from "./components/layout/Layout"
import RutaProtegida from "./components/RutaProtegida"
import Carrito from "./pages/Carrito"
import Catalogo from "./pages/Catalogo"
import Checkout from "./pages/Checkout"
import EnConstruccion from "./pages/EnConstruccion"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import MiCuenta from "./pages/MiCuenta"
import NoEncontrada from "./pages/NoEncontrada"
import ProductoDetalle from "./pages/ProductoDetalle"
import Registro from "./pages/Registro"

// Mapa de la aplicación: qué página se muestra en cada dirección (URL).
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/productos/:id" element={<ProductoDetalle />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Solo clientes con sesión */}
        <Route element={<RutaProtegida rol="cliente" />}>
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/mi-cuenta" element={<MiCuenta />} />
        </Route>

        {/* Solo administradores */}
        <Route element={<RutaProtegida rol="admin" />}>
          <Route path="/admin" element={<EnConstruccion titulo="Panel de administración" />} />
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}

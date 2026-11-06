import { Route, Routes } from "react-router-dom"
import Layout from "./components/layout/Layout"
import RutaProtegida from "./components/RutaProtegida"
import Carrito from "./pages/Carrito"
import Catalogo from "./pages/Catalogo"
import Checkout from "./pages/Checkout"
import AdminLayout from "./pages/admin/AdminLayout"
import Inventario from "./pages/admin/Inventario"
import Plataformas from "./pages/admin/Plataformas"
import Productos from "./pages/admin/Productos"
import Resumen from "./pages/admin/Resumen"
import Ventas from "./pages/admin/Ventas"
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
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Resumen />} />
            <Route path="inventario" element={<Inventario />} />
            <Route path="plataformas" element={<Plataformas />} />
            <Route path="productos" element={<Productos />} />
            <Route path="ventas" element={<Ventas />} />
          </Route>
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}

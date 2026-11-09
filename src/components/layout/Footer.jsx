import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Logo from "./Logo"

const COLUMNAS = [
  {
    titulo: "Colección",
    enlaces: [
      { a: "/catalogo", texto: "Todas las plataformas" },
      { a: "/catalogo?tipo=cuenta", texto: "Cuentas completas" },
      { a: "/catalogo?tipo=pantalla", texto: "Pantallas" }
    ]
  },
  {
    titulo: "Su cuenta",
    enlaces: [
      { a: "/mi-cuenta", texto: "Mis servicios" },
      { a: "/mi-cuenta?tab=compras", texto: "Mis compras" },
      { a: "/carrito", texto: "Mi selección" }
    ]
  },
  {
    titulo: "SH Vision",
    enlaces: [
      { a: "/#como-funciona", texto: "Cómo funciona" },
      { a: "/#preguntas", texto: "Preguntas frecuentes" }
    ]
  }
]

export default function Footer() {
  // El admin no compra: no le mostramos los enlaces de la tienda
  const { esAdmin } = useAuth()
  return (
    <footer className="mt-32 border-t border-white/[0.06] bg-fondo">
      <div className="contenedor py-16">
        <div className={`flex justify-center ${esAdmin ? "" : "pb-14"}`}>
          <Logo />
        </div>
        {!esAdmin && <div className="grid gap-10 border-t border-white/[0.06] pt-12 sm:grid-cols-3">
          {COLUMNAS.map((columna) => (
            <div key={columna.titulo}>
              <h2 className="etiqueta mb-5">{columna.titulo}</h2>
              <ul className="space-y-3">
                {columna.enlaces.map((e) => (
                  <li key={e.texto}>
                    <Link to={e.a} className="enlace-linea text-suave hover:text-tinta">{e.texto}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>}
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="contenedor flex flex-col gap-2 py-6 text-xs text-zinc-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} SH Vision</p>
          <p>Proyecto formativo de Campuslands. Datos ficticios. Las marcas mencionadas pertenecen a sus dueños.</p>
        </div>
      </div>
    </footer>
  )
}

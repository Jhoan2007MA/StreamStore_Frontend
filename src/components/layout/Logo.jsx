import { Link } from "react-router-dom"

// Logotipo tipográfico: sin íconos, solo letras con mucho espacio entre ellas.
// Las marcas de lujo usan su nombre como logo: transmite seguridad.
export default function Logo({ className = "" }) {
  return (
    <Link to="/" aria-label="SH Vision, ir al inicio" className={`group inline-flex flex-col items-center leading-none ${className}`}>
      <span className="text-[1.05rem] tracking-[0.42em] text-tinta sm:text-lg">
        <span className="font-semibold">SH</span>
        <span className="ml-[0.42em] font-light">VISION</span>
      </span>
      {/* Línea dorada que se alarga al pasar el mouse */}
      <span className="mt-1.5 h-px w-6 bg-brand transition-all duration-700 ease-lujo group-hover:w-14" />
    </Link>
  )
}

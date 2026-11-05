// Funciones pequeñas para mostrar datos bonitos en pantalla.

export const formatoPrecio = (valor) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(valor))

export const formatoFecha = (valor) =>
  new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(valor))

export const formatoFechaHora = (valor) =>
  new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(valor))

export const nombreModalidad = (tipo) => (tipo === "cuenta" ? "Cuenta completa" : "Pantalla")

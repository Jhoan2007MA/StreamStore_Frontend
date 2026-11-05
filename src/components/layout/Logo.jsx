import { Play } from "lucide-react"
import { Link } from "react-router-dom"

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
      <span className="grid size-8 place-items-center rounded-lg bg-brand">
        <Play size={16} fill="white" />
      </span>
      Stream<span className="text-brand">Store</span>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

type HeaderProps = {
  onLogout: () => void
}

export const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">TODO一覧</h1>
      <div className="flex items-center gap-4">
        <Link
          to={ROUTES.TRASH}
          className="text-gray-300 hover:text-white text-sm px-3 py-1 rounded border border-gray-500 hover:border-gray-400 transition-colors"
        >
          ゴミ箱
        </Link>
        <button
          onClick={onLogout}
          className="text-gray-300 hover:text-white text-sm px-3 py-1 rounded border border-gray-500 hover:border-gray-400 transition-colors"
        >
          ログアウト
        </button>
      </div>
    </header>
  )
}

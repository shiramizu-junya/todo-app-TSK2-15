import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { supabase } from '../lib/supabase'
import { ROUTES } from '../constants/routes'

export const TodoListPage = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert('ログアウトに失敗しました')
      console.error('Logout error:', error)
      return
    }

    navigate(ROUTES.LOGIN, { state: { message: 'ログアウトしました' } })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={handleLogout} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Link
          to={ROUTES.TODO_NEW}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-3xl"
        >
          +
        </Link>
      </main>
    </div>
  )
}

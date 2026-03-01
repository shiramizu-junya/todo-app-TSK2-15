import { useNavigate } from 'react-router-dom'
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
    </div>
  )
}

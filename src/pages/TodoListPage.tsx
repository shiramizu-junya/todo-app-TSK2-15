import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { TodoItem } from '../components/todo/TodoItem'
import { ROUTES } from '../constants/routes'
import { STATUS_OPTIONS } from '../constants/todo'
import { useAuth } from '../contexts/AuthContext'
import type { Status, Todo } from '../lib/database.types'
import { supabase } from '../lib/supabase'

export const TodoListPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all')

  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) return

      setIsLoading(true)

      let query = supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

      if (statusFilter === 'all') {
        query = query.neq('status', 'completed')
      } else {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error('TODO取得エラー:', error)
      } else {
        setTodos(data ?? [])
      }

      setIsLoading(false)
    }

    fetchTodos()
  }, [user, statusFilter])

  const filteredTodos = useMemo(() => {
    if (!searchQuery) return todos
    const q = searchQuery.toLowerCase()
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(q) ||
        (todo.description && todo.description.toLowerCase().includes(q)),
    )
  }, [todos, searchQuery])

  const handleStatusChange = async (todoId: string, status: Status) => {
    const { error } = await supabase.from('todos').update({ status }).eq('id', todoId)

    if (error) {
      console.error('ステータス更新エラー:', error)
      return
    }

    if (statusFilter === 'all' && status === 'completed') {
      setTodos((prev) => prev.filter((todo) => todo.id !== todoId))
    } else {
      setTodos((prev) => prev.map((todo) => (todo.id === todoId ? { ...todo, status } : todo)))
    }
  }

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
        {/* フィルターエリア */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="タイトル・詳細で検索"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* TODOリスト */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">読み込み中...</div>
        ) : filteredTodos.length > 0 ? (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onStatusChange={handleStatusChange} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">TODOがありません</p>
            <Link
              to={ROUTES.TODO_NEW}
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              TODOを作成する
            </Link>
          </div>
        )}

        {/* FAB */}
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

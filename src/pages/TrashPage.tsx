import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrashItem } from '../components/todo/TrashItem'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../contexts/AuthContext'
import type { Todo } from '../lib/database.types'
import { supabase } from '../lib/supabase'

export const TrashPage = () => {
  const { user } = useAuth()

  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  useEffect(() => {
    const fetchDeletedTodos = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', true)
        .order('deleted_at', { ascending: false })

      if (!error && data) {
        setTodos(data)
      }
      setIsLoading(false)
    }

    fetchDeletedTodos()
  }, [user])

  const handleRestore = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_deleted: false, deleted_at: null })
      .eq('id', id)

    if (!error) {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id)
    setShowDeleteDialog(true)
  }

  const handlePermanentDelete = async () => {
    if (!deleteTargetId) return

    const { error } = await supabase.from('todos').delete().eq('id', deleteTargetId)

    if (!error) {
      setTodos((prev) => prev.filter((todo) => todo.id !== deleteTargetId))
      setShowDeleteDialog(false)
      setDeleteTargetId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-gray-800 text-white py-4 px-4">
        <div className="w-full max-w-2xl mx-auto flex items-center gap-4">
          <Link
            to={ROUTES.HOME}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            ← 戻る
          </Link>
          <h1 className="text-lg font-bold">ゴミ箱</h1>
        </div>
      </header>

      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-500 mb-4">
          削除したTODOは一時的にここに保存されます。復元または完全に削除できます。
        </p>

        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <p className="text-lg font-medium">ゴミ箱は空です</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <TrashItem
                key={todo.id}
                todo={todo}
                onRestore={handleRestore}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* 完全削除確認ダイアログ */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
            <p className="text-gray-800 font-medium mb-4">
              このTODOを完全に削除しますか？この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false)
                  setDeleteTargetId(null)
                }}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handlePermanentDelete}
                className="flex-1 bg-red-500 text-white font-medium py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

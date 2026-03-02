import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '../constants/todo'
import { useAuth } from '../contexts/AuthContext'
import type { Status, Todo } from '../lib/database.types'
import { supabase } from '../lib/supabase'

export const TodoDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [todo, setTodo] = useState<Todo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchTodo = async () => {
      if (!id || !user) return

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('id', id)
        .eq('is_deleted', false)
        .single()

      if (error || !data) {
        navigate(ROUTES.HOME)
        return
      }

      if (data.user_id !== user.id) {
        navigate(ROUTES.HOME)
        return
      }

      setTodo(data)
      setIsLoading(false)
    }

    fetchTodo()
  }, [id, user, navigate])

  const handleStatusChange = async (status: Status) => {
    if (!todo) return

    const { error } = await supabase.from('todos').update({ status }).eq('id', todo.id)

    if (!error) {
      setTodo({ ...todo, status })
    }
  }

  const handleDelete = async () => {
    if (!todo) return

    const { error } = await supabase
      .from('todos')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', todo.id)

    if (!error) {
      navigate(ROUTES.HOME)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  if (!todo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">TODOが見つかりません</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* ヘッダー部 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
          >
            ← TODO一覧へ
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/todos/${todo.id}/edit`)}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              編集
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              削除
            </button>
          </div>
        </div>

        {/* コンテンツ部 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* バッジエリア */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${PRIORITY_COLORS[todo.priority]}`}
            >
              {PRIORITY_LABELS[todo.priority]}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${CATEGORY_COLORS[todo.category]}`}
            >
              {CATEGORY_LABELS[todo.category]}
            </span>
          </div>

          {/* タイトル */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{todo.title}</h1>

          {/* ステータス変更 */}
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              id="status"
              value={todo.status}
              onChange={(e) => handleStatusChange(e.target.value as Status)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {(Object.keys(STATUS_LABELS) as Status[]).map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          {/* 詳細・メモ */}
          {todo.description && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-700 mb-1">詳細・メモ</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{todo.description}</p>
            </div>
          )}

          {/* 期限 */}
          {todo.due_date && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-700 mb-1">期限</h2>
              <p className="text-gray-600">
                {new Date(todo.due_date).toLocaleDateString('ja-JP')}
              </p>
            </div>
          )}

          {/* 作成日 */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-1">作成日</h2>
            <p className="text-gray-600">
              {new Date(todo.created_at).toLocaleDateString('ja-JP')}
            </p>
          </div>

          {/* 添付画像 */}
          {todo.image_url && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-700 mb-1">添付画像</h2>
              <img
                src={todo.image_url}
                alt="添付画像"
                className="max-w-full rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      </div>

      {/* 削除確認ダイアログ */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
            <p className="text-gray-800 font-medium mb-4">このTODOをゴミ箱に移動しますか？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
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

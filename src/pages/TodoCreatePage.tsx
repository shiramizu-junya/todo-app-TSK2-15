import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '../constants/todo'
import { useAuth } from '../contexts/AuthContext'
import type { Category, Priority } from '../lib/database.types'
import { supabase } from '../lib/supabase'

export const TodoCreatePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState<Category>('other')
  const [errors, setErrors] = useState({ title: '', form: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = { title: '', form: '' }

    if (!title.trim()) {
      newErrors.title = 'タイトルを入力してください'
    } else if (title.length > 100) {
      newErrors.title = 'タイトルは100文字以内で入力してください'
    }

    if (newErrors.title) {
      setErrors(newErrors)
      return
    }

    if (!user) {
      setErrors({ title: '', form: '認証エラーが発生しました。再度ログインしてください。' })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.from('todos').insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate || null,
        priority,
        category,
      })

      if (error) {
        setErrors({ title: '', form: error.message })
        return
      }

      navigate(ROUTES.HOME)
    } catch (error) {
      console.error('予期せぬエラー:', error)
      setErrors({ title: '', form: '予期せぬエラーが発生しました' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* タイトル */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">TODO作成</h1>
          </div>

          {/* フォームエラー */}
          {errors.form && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.form}</p>
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* タイトル */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setErrors((prev) => ({ ...prev, title: '' }))
                }}
                maxLength={100}
                placeholder="TODOのタイトルを入力"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.title
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* 詳細・メモ */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                詳細・メモ
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="詳細やメモを入力"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 期限 */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                期限
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 優先度 */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                優先度
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* カテゴリ */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリ
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ボタン */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(ROUTES.HOME)}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '保存中...' : '保存する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

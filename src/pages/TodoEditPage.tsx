import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { CATEGORY_OPTIONS, IMAGE_ACCEPT, PRIORITY_OPTIONS, STATUS_LABELS } from '../constants/todo'
import { useAuth } from '../contexts/AuthContext'
import type { Category, Priority, Status } from '../lib/database.types'
import { deleteTodoImage, uploadTodoImage, validateImageFile } from '../lib/storage'
import { supabase } from '../lib/supabase'

export const TodoEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState<Category>('other')
  const [status, setStatus] = useState<Status>('not_started')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState({ title: '', form: '', image: '' })

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

      setTitle(data.title)
      setDescription(data.description ?? '')
      setDueDate(data.due_date ?? '')
      setPriority(data.priority)
      setCategory(data.category)
      setStatus(data.status)
      setImageUrl(data.image_url)
      setOriginalImageUrl(data.image_url)
      setIsLoading(false)
    }

    fetchTodo()
  }, [id, user, navigate])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      setErrors((prev) => ({ ...prev, image: validationError }))
      return
    }

    setErrors((prev) => ({ ...prev, image: '' }))
    setImageFile(file)

    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleImageRemove = () => {
    setImageUrl(null)
    setImageFile(null)
    setImagePreview(null)
    setErrors((prev) => ({ ...prev, image: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = { title: '', form: '', image: '' }

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
      setErrors({
        title: '',
        form: '認証エラーが発生しました。再度ログインしてください。',
        image: '',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Delete old image from Storage if it was removed or replaced
      if (originalImageUrl && originalImageUrl !== imageUrl && !imageFile) {
        await deleteTodoImage(originalImageUrl)
      }
      if (originalImageUrl && imageFile) {
        await deleteTodoImage(originalImageUrl)
      }

      // Upload new image if selected
      let finalImageUrl = imageUrl
      if (imageFile) {
        const result = await uploadTodoImage(imageFile, user.id, id!)
        if ('error' in result) {
          setErrors({ title: '', form: `画像のアップロードに失敗しました: ${result.error}`, image: '' })
          return
        }
        finalImageUrl = result.url
      }

      const { error } = await supabase
        .from('todos')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          due_date: dueDate || null,
          priority,
          category,
          status,
          image_url: finalImageUrl,
        })
        .eq('id', id!)

      if (error) {
        setErrors({ title: '', form: error.message, image: '' })
        return
      }

      navigate(`/todos/${id}`)
    } catch (error) {
      console.error('予期せぬエラー:', error)
      setErrors({ title: '', form: '予期せぬエラーが発生しました', image: '' })
    } finally {
      setIsSubmitting(false)
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* タイトル */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">TODO編集</h1>
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

            {/* ステータス */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                ステータス
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            {/* 画像アップロード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">添付画像</label>
              {imageUrl || imagePreview ? (
                <div>
                  <img
                    src={imagePreview ?? imageUrl!}
                    alt="添付画像"
                    className="max-w-full rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    画像を削除
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept={IMAGE_ACCEPT}
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              )}
              {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
            </div>

            {/* ボタン */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/todos/${id}`)}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '更新中...' : '更新する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

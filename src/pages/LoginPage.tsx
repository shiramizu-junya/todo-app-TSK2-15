import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ROUTES } from '../constants/routes'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const message = location.state?.message || ''
  const errorMessage = location.state?.errorMessage || ''

  useEffect(() => {
    if (message || errorMessage) {
      window.history.replaceState({}, '')
    }
  }, [message, errorMessage])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    if (email.length === 0 || password.length === 0) {
      const newErrors = {
        email: email.length === 0 ? 'メールアドレスを入力してください' : '',
        password: password.length === 0 ? 'パスワードを入力してください' : '',
      }
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrors({
          email: 'メールアドレスまたはパスワードが正しくありません',
          password: '',
        })
        return
      }

      navigate(ROUTES.HOME)
    } catch (error) {
      console.error('予期せぬエラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* ロゴ */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">ログイン</h1>
            <p className="text-gray-500 text-sm mt-1">アカウントにログインしてください</p>
          </div>

          {/* 成功メッセージ */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm text-center">
              {message}
            </div>
          )}

          {/* エラーメッセージ */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
              {errorMessage}
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* パスワード */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8文字以上"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          {/* リンク */}
          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm">
              <Link to={ROUTES.RESET_PASSWORD} className="text-blue-500 hover:underline">
                パスワードをお忘れの方はこちら
              </Link>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">アカウントをお持ちでない方は</span>
              <Link to={ROUTES.SIGNUP} className="text-blue-500 hover:underline ml-1">
                新規登録
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

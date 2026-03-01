import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ROUTES } from '../constants/routes'

export const ResetPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('メールアドレスの形式が正しくありません')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
      if (error) {
        setError('パスワードリセットメールの送信に失敗しました')
        console.error('Reset password error:', error)
        return
      }
      setIsSubmitted(true)
    } catch (err) {
      console.error('予期せぬエラー:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* アイコン */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔑</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">パスワードリセット</h1>
            <p className="text-gray-500 text-sm mt-1">登録済みのメールアドレスを入力してください</p>
          </div>

          {isSubmitted ? (
            /* 送信完了メッセージ */
            <div>
              <div className="p-4 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm text-center">
                <p className="font-medium">メールを送信しました</p>
                <p className="mt-1">
                  パスワードリセット用のリンクをメールで送信しました。メールをご確認ください。
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link to={ROUTES.LOGIN} className="text-sm text-blue-500 hover:underline">
                  ログイン画面に戻る
                </Link>
              </div>
            </div>
          ) : (
            /* フォーム */
            <div>
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
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    placeholder="example@email.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                </div>

                {/* 送信ボタン */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '送信中...' : 'リセットメールを送信'}
                </button>
              </form>

              {/* 戻るリンク */}
              <div className="mt-6 text-center">
                <Link to={ROUTES.LOGIN} className="text-sm text-blue-500 hover:underline">
                  ログイン画面に戻る
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

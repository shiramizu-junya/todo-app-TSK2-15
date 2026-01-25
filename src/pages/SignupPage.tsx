import { useState } from 'react'
import { Link } from 'react-router-dom'

export const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // エラーをリセット
    const newErrors = { email: '', password: '', confirmPassword: '' }

    // メールアドレスの形式チェック
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'メールアドレスの形式が正しくありません'
    }

    // パスワードの長さチェック
    if (password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください'
    }

    // パスワード確認チェック
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません'
    }

    // エラーがあれば設定して処理を止める
    if (newErrors.email || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors)
      return
    }

    // TODO: Supabase Auth signUp APIの呼び出し
    console.log('バリデーション成功:', { email, password })
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
            <h1 className="text-2xl font-bold text-gray-800">新規登録</h1>
            <p className="text-gray-500 text-sm mt-1">アカウントを作成してください</p>
          </div>

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
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrors((prev) => ({ ...prev, email: '' }))
                }}
                placeholder="example@email.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
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
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrors((prev) => ({ ...prev, password: '' }))
                }}
                placeholder="8文字以上"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
                minLength={8}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* パスワード確認 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                パスワード（確認） <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }))
                }}
                placeholder="パスワードを再入力"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
                minLength={8}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 登録ボタン */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              登録する
            </button>
          </form>

          {/* ログインリンク */}
          <div className="mt-6 text-center">
            <p className="text-sm">
              <span className="text-gray-500">すでにアカウントをお持ちの方は</span>
              <Link to="/login" className="text-blue-500 hover:underline ml-1">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

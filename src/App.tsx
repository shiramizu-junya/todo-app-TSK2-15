import { useEffect } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { SignupPage } from "./pages/SignupPage"
import { ResetPasswordPage } from "./pages/ResetPasswordPage"
import { TodoListPage } from "./pages/TodoListPage"
import { TodoCreatePage } from "./pages/TodoCreatePage"
import { TodoDetailPage } from "./pages/TodoDetailPage"
import { TodoEditPage } from "./pages/TodoEditPage"
import { TrashPage } from "./pages/TrashPage"
import { UpdatePasswordPage } from "./pages/UpdatePasswordPage"
import { supabase } from "./lib/supabase"

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    // ハッシュフラグメントのエラーを検知（Supabaseのリダイレクトエラー）
    const hash = window.location.hash
    if (hash.includes('error=')) {
      const params = new URLSearchParams(hash.substring(1))
      const errorDescription = params.get('error_description')
      const message = errorDescription === 'Email link is invalid or has expired'
        ? 'メールリンクが無効または有効期限切れです。再度お試しください。'
        : 'エラーが発生しました。再度お試しください。'
      navigate('/login', { state: { errorMessage: message }, replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/update-password')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <Routes>
      {/* 認証不要 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />

      {/* 認証必要 */}
      <Route path="/" element={<TodoListPage />} />
      <Route path="/todos/new" element={<TodoCreatePage />} />
      <Route path="/todos/:id" element={<TodoDetailPage />} />
      <Route path="/todos/:id/edit" element={<TodoEditPage />} />
      <Route path="/trash" element={<TrashPage />} />
    </Routes>
  )
}

export default App

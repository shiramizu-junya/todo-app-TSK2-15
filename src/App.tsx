import { useEffect } from 'react'
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { AuthGuard } from './components/layout/AuthGuard'
import { ROUTES } from './constants/routes'
import { supabase } from './lib/supabase'
import { LoginPage } from './pages/LoginPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SignupPage } from './pages/SignupPage'
import { TodoCreatePage } from './pages/TodoCreatePage'
import { TodoDetailPage } from './pages/TodoDetailPage'
import { TodoEditPage } from './pages/TodoEditPage'
import { TodoListPage } from './pages/TodoListPage'
import { TrashPage } from './pages/TrashPage'
import { UpdatePasswordPage } from './pages/UpdatePasswordPage'

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    // ハッシュフラグメントのエラーを検知（Supabaseのリダイレクトエラー）
    const hash = window.location.hash
    if (hash.includes('error=')) {
      const params = new URLSearchParams(hash.substring(1))
      const errorDescription = params.get('error_description')
      const message =
        errorDescription === 'Email link is invalid or has expired'
          ? 'メールリンクが無効または有効期限切れです。再度お試しください。'
          : 'エラーが発生しました。再度お試しください。'
      navigate(ROUTES.LOGIN, { state: { errorMessage: message }, replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate(ROUTES.UPDATE_PASSWORD)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <Routes>
      {/* 認証不要 */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route path={ROUTES.UPDATE_PASSWORD} element={<UpdatePasswordPage />} />

      {/* 認証必要 */}
      <Route
        element={
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        }
      >
        <Route path={ROUTES.HOME} element={<TodoListPage />} />
        <Route path={ROUTES.TODO_NEW} element={<TodoCreatePage />} />
        <Route path={ROUTES.TODO_DETAIL} element={<TodoDetailPage />} />
        <Route path={ROUTES.TODO_EDIT} element={<TodoEditPage />} />
        <Route path={ROUTES.TRASH} element={<TrashPage />} />
      </Route>
    </Routes>
  )
}

export default App

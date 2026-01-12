import { Route, Routes } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { SignupPage } from "./pages/SignupPage"
import { ResetPasswordPage } from "./pages/ResetPasswordPage"
import { TodoListPage } from "./pages/TodoListPage"
import { TodoCreatePage } from "./pages/TodoCreatePage"
import { TodoDetailPage } from "./pages/TodoDetailPage"
import { TodoEditPage } from "./pages/TodoEditPage"
import { TrashPage } from "./pages/TrashPage"
function App() {
  return (
    <Routes>
      {/* 認証不要 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

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

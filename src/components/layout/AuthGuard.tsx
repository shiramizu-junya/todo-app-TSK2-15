import { Navigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../contexts/AuthContext'

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return null
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ errorMessage: 'ログインが必要です。' }} replace />
  }

  return <>{children}</>
}

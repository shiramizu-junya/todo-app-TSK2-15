import type { User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ユーザーのセッションを確認して、userとisLoadingを適切に更新するロジックを追加する
  useEffect(() => {
    const checkSession = async () => {
      // ここでSupabaseのセッションを確認し、ユーザー情報を取得するロジックを実装する
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setIsLoading(false)
    }

    // getOnAuthStateChangeを使用して、認証状態の変化を監視するロジックも追加する
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    checkSession()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

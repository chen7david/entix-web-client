import { isLoginAtom } from '@/store/auth.atom'
import { useAtom } from 'jotai'
import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoutes = () => {
  const [isLogin] = useAtom(isLoginAtom)
  return isLogin ? <Outlet /> : <Navigate to="/login" />
}

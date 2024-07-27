import { Home } from '@/pages/home/Home'
import { UsersList } from '@/pages/users/UsersList'
import { Route, Routes } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import { Login } from '@/pages/login/Login'
import { OptEmail } from '@/pages/opts/OptEmail'
import { PublicRoutes } from './PublicRoutes'
import { OptPasswordRecovery } from '@/pages/opts/OptPasswordRecovery'

export const Pages = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicRoutes />}>
        <Route path="/verify-email" element={<OptEmail />} />
        <Route path="/password-recovery" element={<OptPasswordRecovery />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* PRIVATE */}
      <Route element={<PrivateRoutes />}>
        <Route path="/users/list" element={<UsersList />} />
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}

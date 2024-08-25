import { Home } from '@/pages/home/Home'
import { UsersList } from '@/pages/users/UsersList'
import { Route, Routes } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import { Login } from '@/pages/login/Login'
import { OptEmail } from '@/pages/opts/OptEmail'
import { PublicRoutes } from './PublicRoutes'
import { OptPasswordRecovery } from '@/pages/opts/OptPasswordRecovery'
import { Profile } from '@/pages/profile/Profile'
import { Wallet } from '@/pages/wallet/Wallet'
import { OrderList } from '@/pages/orders/Orders'
import { Shop } from '@/pages/shop/Shop'
import { GroupList } from '@/pages/groups/GroupList'
import { SessionList } from '@/pages/sessions/SessionList'

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
        <Route path="/users" element={<UsersList />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/sessions" element={<SessionList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}

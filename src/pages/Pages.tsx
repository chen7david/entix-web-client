import { Route, Routes } from 'react-router-dom'
import { Home } from './home/Home'
import { Register } from './register/Register'
import { UsersList } from './users/UsersList'

export const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users/list" element={<UsersList />} />
    </Routes>
  )
}

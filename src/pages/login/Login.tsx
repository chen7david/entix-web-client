import { Button, Checkbox, Form, Input, message } from 'antd'
import { useState } from 'react'
import Logo from '/entix-bw.svg'
import { useAtom } from 'jotai'
import { LoginUserDto, ILoginUserDto } from 'entix-shared'
import { loginUser } from '@/api/client.api'
import { BrowserStore } from '@/store/browserstore.store'
import { currUserAtom, isAdminAtom, isLoginAtom } from '@/store/auth.atom'
import { createSchemaFieldRule } from 'antd-zod'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const [, setIsLogin] = useAtom(isLoginAtom)
  const [, setIsAdmin] = useAtom(isAdminAtom)
  const [, setCurrUser] = useAtom(currUserAtom)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const LoginUserDtoRule = createSchemaFieldRule(LoginUserDto)

  const handleSubmit = async (loginUserDto: ILoginUserDto) => {
    try {
      setIsLoading(true)
      const { user, accessToken, refreshToken } = await loginUser(loginUserDto)
      setCurrUser(user)
      setIsLogin(true)
      setIsAdmin(true)
      BrowserStore.setAccessToken(accessToken)
      BrowserStore.setRefreshToken(refreshToken)
      BrowserStore.setCurrUser(user)
      BrowserStore.setIsAdmin(true)
      message.success('Welcome back!')
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-1 h-full bg-gray-100 justify-center items-center">
      <div className="max-w-md w-80 py-10 px-6 bg-white rounded-lg shadow-md space-y-4 m-4">
        <div className="flex justify-center pb-4">
          <img className="w-16" src={Logo} alt="" />
        </div>
        <div className="flex">
          <Form
            className="w-full space-y-6"
            autoComplete="off"
            size="large"
            onFinish={handleSubmit}
          >
            <Form.Item required name="username" rules={[LoginUserDtoRule]}>
              <Input
                prefix={<UserOutlined />}
                allowClear
                placeholder="username"
              />
            </Form.Item>
            <Form.Item required name="password" rules={[LoginUserDtoRule]}>
              <Input.Password
                prefix={<LockOutlined />}
                allowClear
                placeholder="password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a
                onClick={() => navigate('/password-recovery')}
                className="text-blue-600 float-right"
              >
                Forgot password
              </a>
            </Form.Item>
            <Form.Item>
              <Button block loading={isLoading} htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

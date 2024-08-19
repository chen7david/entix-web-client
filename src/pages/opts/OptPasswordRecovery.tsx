import Logo from '/entix-bw.svg'
import { Button, Form, Input, message } from 'antd'
// import { createSchemaFieldRule } from 'antd-zod'
// import { UsernameDto } from 'entix-shared'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { sendPasswordRecoveryEmail } from '@/api/client.api'
import { UserOutlined } from '@ant-design/icons'

export const OptPasswordRecovery = () => {
  // const UsernameDtoRule = createSchemaFieldRule(UsernameDto)
  const navigate = useNavigate()

  const setPasswordRecoveryMutation = useMutation({
    mutationFn: sendPasswordRecoveryEmail,
    onSuccess: () => {
      navigate('/login')
      message.success(
        `Your password recovery request was successful, please check your email!`,
      )
    },
  })

  return (
    <div className="flex flex-1 h-full bg-gray-100 justify-center items-center">
      <div className="max-w-md w-80 py-10 px-6 bg-white rounded-lg shadow-md space-y-4 m-4">
        <div className="flex justify-center pb-4">
          <img className="w-16" src={Logo} alt="" />
        </div>
        <div className="text-center text-1xl font-extrabold">
          Password Recovery Request
        </div>
        <div className="flex">
          <Form
            className="w-full space-y-6"
            autoComplete="off"
            size="large"
            onFinish={setPasswordRecoveryMutation.mutate}
          >
            <Form.Item required name="username" rules={[]}>
              <Input
                allowClear
                placeholder="Username"
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button
                loading={setPasswordRecoveryMutation.isPending}
                block
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>

            <Form.Item>
              <a onClick={() => navigate('/login')} className="text-blue-600">
                Go to login page
              </a>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

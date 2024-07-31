import Logo from '/entix-bw.svg'
import { Button, Form, Input, message } from 'antd'
import { createSchemaFieldRule } from 'antd-zod'
import { useSearchParams } from 'react-router-dom'
import { OptDto } from 'entix-shared'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { activateAccount } from '@/api/client.api'

export const OptEmail = () => {
  const OptDtoRule = createSchemaFieldRule(OptDto)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const passcode = searchParams.get('passcode')?.toUpperCase()

  const activateAccountMutation = useMutation({
    mutationFn: activateAccount,
    onSuccess: () => {
      navigate('/login')
      message.success('Account was activated, please proceed to login!')
    },
  })

  return (
    <div className="flex flex-1 h-full bg-gray-100 justify-center items-center">
      <div className="max-w-md w-80 py-10 px-6 bg-white rounded-lg shadow-md space-y-4 m-4">
        <div className="flex justify-center pb-4">
          <img className="w-16" src={Logo} alt="" />
        </div>
        <div className="text-center text-1xl font-extrabold">
          Account Activation
        </div>
        <div className="flex">
          <Form
            className="w-full space-y-6"
            autoComplete="off"
            size="large"
            initialValues={{ passcode }}
            onFinish={activateAccountMutation.mutate}
          >
            <Form.Item required name="passcode" rules={[OptDtoRule]}>
              <Input.OTP
                formatter={(str) => str.toUpperCase()}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                loading={activateAccountMutation.isPending}
                block
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

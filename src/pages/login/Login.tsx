import { Button, Input } from 'antd'
import { useState, ChangeEvent, MouseEvent } from 'react'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import Logo from '/entix-bw.svg'
interface ILoginFormProps {
  onSubmit: (props: ILoginFormState) => void
}

export interface ILoginFormState {
  username: string
  password: string
}

export const Login = ({ onSubmit }: ILoginFormProps) => {
  const [formData, setFormData] = useState<ILoginFormState>({
    username: '',
    password: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    console.log('Form data submitted:', formData)
    onSubmit(formData)
  }

  return (
    <div className="flex flex-1 bg-gray-100 justify-center items-center">
      <div className="max-w-md w-full py-12 px-6 bg-white rounded-lg shadow-md space-y-4 m-4 ">
        <div className="flex justify-center pb-4">
          <img className="w-20" src={Logo} alt="" />
        </div>

        <form className="mt-8 space-y-6 px-2">
          <Input
            size="large"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <Input.Password
            placeholder="Password"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button onClick={handleSubmit} size="large" block>
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

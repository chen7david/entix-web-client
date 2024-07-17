import { Button, Input, message } from 'antd'
import { useState, ChangeEvent, MouseEvent, useCallback } from 'react'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import Logo from '/entix-bw.svg'
import { useAtom } from 'jotai'
import { loginFormValidationAtom } from './../../store/error.atom'
import { debounce } from 'lodash'
import { LoginUserDto } from 'entix-shared'

interface ILoginFormProps {
  onSubmit: (props: ILoginFormState) => void
}

export interface ILoginFormState {
  username: string
  password: string
}

export const Login = ({ onSubmit }: ILoginFormProps) => {
  const [isFormValid, setIsFormValid] = useState(false)
  const [errors, setErrors] = useAtom(loginFormValidationAtom)
  const [formData, setFormData] = useState<ILoginFormState>({
    username: '',
    password: '',
  })

  const validateForm = useCallback(
    debounce((data: ILoginFormState) => {
      const { success, error } = LoginUserDto.safeParse(data)
      if (!success) {
        setErrors(error?.format())
        setIsFormValid(false)
      } else {
        setErrors(null)
        setIsFormValid(true)
      }
    }, 500),
    [setErrors],
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value }
      validateForm(updatedData)
      return updatedData
    })
  }

  const handleSubmit = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    if (isFormValid) {
      await onSubmit(formData)
      message.success('Welcome back!')
    }
  }

  return (
    <div className="flex flex-1 bg-gray-100 justify-center items-center">
      <div className="max-w-md w-full py-12 px-6 bg-white rounded-lg shadow-md space-y-4 m-4 ">
        <div className="flex justify-center pb-4">
          <img className="w-20" src={Logo} alt="" />
        </div>
        <form className="mt-8 space-y-6 px-2">
          <div className="flex flex-col space-y-1">
            <Input
              allowClear
              size="large"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              status={errors?.username?._errors ? 'error' : ''}
            />
            {errors?.username?._errors && (
              <span className="text-red-500 text-sm">
                {errors.username._errors[0]}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Input.Password
              allowClear
              placeholder="Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              name="password"
              value={formData.password}
              onChange={handleChange}
              status={errors?.password?._errors ? 'error' : ''}
            />
            {errors?.password?._errors && (
              <span className="text-red-500 text-sm">
                {errors.password._errors[0]}
              </span>
            )}
          </div>
          <Button
            disabled={!isFormValid}
            onClick={handleSubmit}
            size="large"
            block
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

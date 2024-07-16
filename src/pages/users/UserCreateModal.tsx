import { ChangeEvent, useCallback, MouseEvent, useState } from 'react'
import { Button, Drawer, DatePicker, DatePickerProps, Select } from 'antd'
import { debounce } from 'lodash'
import { useAtom } from 'jotai'
import { createUserFormValidationAtom } from './../../store/error.atom'
import { CreateUserDto, ICreateUserDto } from 'entix-shared'
import { Input, InputPassword } from './../../components/Form/Input'

type ISex = 'female' | 'male'

const defaultFormData: ICreateUserDto = {
  username: '',
  password: '',
  last_name: '',
  first_name: '',
  email: '',
  sex: 'male',
  date_of_birth: '',
  profile_image_url: '',
}

type IUserCreateModalProps = {
  onSubmit: (formData: ICreateUserDto) => Promise<void>
}

export const UserCreateModal = ({ onSubmit }: IUserCreateModalProps) => {
  const [open, setOpen] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [errors, setErrors] = useAtom(createUserFormValidationAtom)
  const [formData, setFormData] = useState<ICreateUserDto>(defaultFormData)

  const clearForm = () => {
    setFormData(defaultFormData)
    setErrors(null)
    setIsFormValid(false)
  }

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const validateForm = useCallback(
    debounce((data: ICreateUserDto) => {
      const { success, error } = CreateUserDto.safeParse(data)
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
      onClose()
      clearForm()
    }
  }

  const onChangeDateOfBirth: DatePickerProps['onChange'] = (_, dateString) => {
    if (typeof dateString === 'string') {
      setFormData((prevData) => {
        const updatedData = { ...prevData, date_of_birth: dateString }
        validateForm(updatedData)
        return updatedData
      })
    }
  }

  return (
    <>
      <div className="my-4">
        <Button onClick={showDrawer}>New User</Button>
      </div>
      <Drawer title="New User" onClose={onClose} open={open}>
        <form className="mt-8 space-y-6 px-2">
          <Input
            label="Username"
            onChange={handleChange}
            name="username"
            value={formData.username}
            error={errors?.username?._errors[0]}
          />
          <Input
            label="Email"
            onChange={handleChange}
            name="email"
            value={formData.email}
            error={errors?.email?._errors[0]}
          />
          <InputPassword
            label="Password"
            onChange={handleChange}
            name="password"
            value={formData.password}
            error={errors?.password?._errors[0]}
          />
          <Input
            label="First Name"
            onChange={handleChange}
            name="first_name"
            value={formData.first_name}
            error={errors?.first_name?._errors[0]}
          />
          <Input
            label="Last Name"
            onChange={handleChange}
            name="last_name"
            value={formData.last_name}
            error={errors?.last_name?._errors[0]}
          />

          <DatePicker
            placeholder="Date of Birth"
            style={{ width: '100%' }}
            size="large"
            onChange={onChangeDateOfBirth}
            status={errors?.date_of_birth ? 'error' : undefined}
          />
          {errors?.date_of_birth && (
            <span className="text-red-500 text-sm">
              {errors?.date_of_birth._errors[0]}
            </span>
          )}

          <Select
            size="large"
            style={{ width: '100%' }}
            defaultValue={formData.sex}
            onChange={(sex: ISex) => {
              if (typeof sex === 'string') {
                setFormData((prevData) => {
                  const updatedData = { ...prevData, sex }
                  validateForm(updatedData)
                  return updatedData
                })
              }
            }}
            options={[
              { value: 'male', label: <span>Male</span> },
              { value: 'female', label: <span>Female</span> },
            ]}
          />

          <Button
            disabled={!isFormValid}
            onClick={handleSubmit}
            size="large"
            block
          >
            Submit
          </Button>
        </form>
      </Drawer>
    </>
  )
}

import { ChangeEvent, useCallback, MouseEvent, useState } from 'react'
import {
  Button,
  Drawer,
  DatePicker,
  DatePickerProps,
  Select,
  message,
} from 'antd'
import { debounce } from 'lodash'
import { useAtom } from 'jotai'
import { createUserFormValidationAtom } from '@/store/error.atom'
import {
  CreateUserDto,
  ICloudinaryUploadResponse,
  ICreateUserDto,
  IPaginatedFilterResponse,
  IViewUserDto,
} from 'entix-shared'
import { Input, InputPassword } from '@/components/Form/Input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '@/api/client.api'
import { AvatarUploader } from '@/components/Form/UploadAvatar'
import { z } from 'zod'

type ISex = 'female' | 'male'

export const TestShema = CreateUserDto.extend({
  date_of_birth: z.union([z.null(), z.date()]),
})

export type IItestShema = z.infer<typeof TestShema>

const defaultFormData: IItestShema = {
  username: '',
  password: '',
  last_name: '',
  first_name: '',
  email: '',
  sex: 'male',
  date_of_birth: null,
  profile_image_url: '',
}

export const UserCreateModal = () => {
  const [open, setOpen] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [errors, setErrors] = useAtom(createUserFormValidationAtom)
  const [formData, setFormData] = useState<IItestShema>(defaultFormData)
  const queryClient = useQueryClient()

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      queryClient.setQueryData(
        ['users'],
        (oldUsers: IPaginatedFilterResponse<IViewUserDto[]>) => {
          return {
            ...oldUsers,
            data: [newUser, ...oldUsers.data],
          }
        },
      )
    },
  })

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
    debounce((data: IItestShema) => {
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
    console.log(e)
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
      await createUserMutation.mutate(formData as ICreateUserDto)
      onClose()
      clearForm()
      message.success('User created successfully')
    }
  }

  const onChangeDateOfBirth: DatePickerProps['onChange'] = (_, dateString) => {
    if (typeof dateString === 'string') {
      setFormData((prevData) => {
        const updatedData = { ...prevData, date_of_birth: new Date(dateString) }
        validateForm(updatedData)
        return updatedData
      })
    }
  }

  const onChangeAvatar = async (response: ICloudinaryUploadResponse) => {
    if (!response.secure_url) return
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        profile_image_url: response.secure_url,
      }
      validateForm(updatedData)
      console.log(updatedData)
      return updatedData
    })
  }

  return (
    <>
      <div className="my-4">
        <Button onClick={showDrawer}>New User</Button>
      </div>
      <Drawer title="New User" onClose={onClose} open={open}>
        <form className="mt-8 space-y-6 px-2">
          <AvatarUploader onUploaded={onChangeAvatar} />
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

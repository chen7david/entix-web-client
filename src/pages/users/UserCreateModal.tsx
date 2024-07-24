import { useEffect, useState } from 'react'
import { Button, Drawer, DatePicker, Select, message, Form, Input } from 'antd'
import {
  CreateUserDto,
  ICreateUserDto,
  IPaginatedFilterResponse,
  IViewUserDto,
  UpdateUserDto,
} from 'entix-shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser, updateUser } from '@/api/client.api'
import { createSchemaFieldRule } from 'antd-zod'
import dayjs, { Dayjs } from 'dayjs'
import { editUserAtom, editUserStatusAtom } from '@/store/update.atom'
import { useAtom } from 'jotai'
import { AvatarUploader } from '@/components/Form/UploadAvatar'

export const UserCreateModal = () => {
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editUser, setEditUser] = useAtom(editUserAtom)
  const [isEditingUser, setIsEditingUser] = useAtom(editUserStatusAtom)
  const CreateUserDtoRule = createSchemaFieldRule(CreateUserDto)
  const UpdateUserDtoRule = createSchemaFieldRule(UpdateUserDto)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isEditingUser) {
      setIsDrawerOpen(true)
      form.setFieldsValue({
        ...editUser,
        date_of_birth: dayjs(editUser?.date_of_birth),
      })
    }
  }, [isEditingUser, form])

  const closeDrawer = () => {
    setEditUser(null)
    setIsDrawerOpen(false)
    setIsEditingUser(false)
    form.resetFields()
  }

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
      closeDrawer()
      form.resetFields()
      message.success('User created successfully')
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        ['users'],
        (oldUsers: IPaginatedFilterResponse<IViewUserDto[]>) => ({
          ...oldUsers,
          data: oldUsers.data.map((user) =>
            user.id === updatedUser.id ? updatedUser : user,
          ),
        }),
      )
      closeDrawer()
      message.success('User updated successfully')
    },
  })

  const handleOnsubmit = (v: ICreateUserDto) => {
    if (!v.profile_image_url) v.profile_image_url = ''
    if (isEditingUser && editUser) {
      updateUserMutation.mutate({ userId: editUser.id, formData: v })
    } else {
      createUserMutation.mutate(v)
    }
  }

  const disableFutureDates = (current: Dayjs | null): boolean => {
    return current !== null && current > dayjs().endOf('day')
  }

  return (
    <>
      <div className="my-4">
        <Button onClick={() => setIsDrawerOpen(true)}>New User</Button>
      </div>
      <Drawer
        title={`${isEditingUser ? 'Edit' : 'Add'} User`}
        onClose={() => closeDrawer()}
        open={isDrawerOpen}
        extra={<Button onClick={() => form.resetFields()}>Clear</Button>}
      >
        <Form
          form={form}
          onFinish={handleOnsubmit}
          size="large"
          title="AddEditUserForm"
          key={isEditingUser ? 'Edit' : 'New'}
        >
          <Form.Item>
            <AvatarUploader
              onUploaded={async ({ secure_url }) => {
                form.setFieldValue('profile_image_url', secure_url)
              }}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="username"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Input disabled={isEditingUser} placeholder="Username" />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="email"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Input disabled={isEditingUser} placeholder="Email" />
          </Form.Item>
          <Form.Item
            hidden={isEditingUser}
            hasFeedback
            name="password"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="first_name"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Input placeholder="First name" />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="last_name"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Input placeholder="Last name" />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="sex"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Select
              placeholder="Sex"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="date_of_birth"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Date of birth"
              disabledDate={disableFutureDates}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item hidden={isEditingUser}>
            <Button
              loading={createUserMutation.isPending}
              block
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
          <Form.Item hidden={!isEditingUser}>
            <Button
              loading={updateUserMutation.isPending}
              block
              htmlType="submit"
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

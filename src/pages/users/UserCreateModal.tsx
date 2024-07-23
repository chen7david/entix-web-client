import { useState } from 'react'
import { Button, Drawer, DatePicker, Select, message, Form, Input } from 'antd'
import {
  CreateUserDto,
  ICreateUserDto,
  IPaginatedFilterResponse,
  IViewUserDto,
} from 'entix-shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '@/api/client.api'
import { createSchemaFieldRule } from 'antd-zod'
import dayjs, { Dayjs } from 'dayjs'

export const UserCreateModal = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const queryClient = useQueryClient()
  const [form] = Form.useForm()

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
      setIsDrawerOpen(false)
      form.resetFields()
      message.success('User created successfully')
    },
  })

  const CreateUserDtoRule = createSchemaFieldRule(CreateUserDto)

  const handleOnsubmit = (v: ICreateUserDto) => {
    if (!v.profile_image_url) v.profile_image_url = ''
    createUserMutation.mutate(v)
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
        title="New User"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={<Button onClick={() => form.resetFields()}>Clear</Button>}
      >
        <Form
          form={form}
          onFinish={handleOnsubmit}
          size="large"
          title="New User"
        >
          <Form.Item hasFeedback name="username" rules={[CreateUserDtoRule]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item hasFeedback name="email" rules={[CreateUserDtoRule]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item hasFeedback name="password" rules={[CreateUserDtoRule]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item hasFeedback name="first_name" rules={[CreateUserDtoRule]}>
            <Input placeholder="First name" />
          </Form.Item>
          <Form.Item hasFeedback name="last_name" rules={[CreateUserDtoRule]}>
            <Input placeholder="Last name" />
          </Form.Item>
          <Form.Item hasFeedback name="sex" rules={[CreateUserDtoRule]}>
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
            rules={[CreateUserDtoRule]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Date of birth"
              disabledDate={disableFutureDates}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={createUserMutation.isPending}
              block
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

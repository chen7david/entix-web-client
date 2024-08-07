import { useEffect, useState } from 'react'
import { UserAddOutlined } from '@ant-design/icons'
import {
  Button,
  Drawer,
  DatePicker,
  Select,
  message,
  Form,
  Input,
  Space,
  Badge,
} from 'antd'
import {
  CreateUserDto,
  ICreateUserDto,
  IPaginatedFilterResponse,
  IViewUserDto,
  UpdateUserDto,
} from 'entix-shared'
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  forceActivateAccount,
  createUser,
  sendAccountActivationEmail,
  updateUser,
} from '@/api/client.api'
import { createSchemaFieldRule } from 'antd-zod'
import dayjs, { Dayjs } from 'dayjs'
import { editUserAtom, editUserStatusAtom } from '@/store/update.atom'
import { useAtom } from 'jotai'
import { AvatarUploader } from '@/components/Form/UploadAvatar'
import { useHotkeys } from 'react-hotkeys-hook'
import { UserDeleteModel } from './UserDeleteModel'
import timezones from 'timezones-list'
import utc from 'dayjs/plugin/utc'
import { useSearchParams } from 'react-router-dom'
dayjs.extend(utc)

export const UserAddEditForm = () => {
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCloseDrawerOnSuccess, setIsCloseDrawerOnSuccess] = useState(false)
  const [isManualActivation, setIsManualActivation] = useState(false)
  const [editUser, setEditUser] = useAtom(editUserAtom)
  const [isEditingUser, setIsEditingUser] = useAtom(editUserStatusAtom)
  const CreateUserDtoRule = createSchemaFieldRule(CreateUserDto)
  const UpdateUserDtoRule = createSchemaFieldRule(UpdateUserDto)
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams({
    q: '',
    sortBy: 'created_at:desc',
    limit: '10',
  })

  const q = searchParams.get('q') || ''

  useHotkeys('ctrl+k', () => setIsManualActivation(!isManualActivation), [
    isManualActivation,
  ])

  useEffect(() => {
    if (isEditingUser) {
      setIsDrawerOpen(true)
      form.setFieldsValue({
        ...editUser,
        date_of_birth: dayjs(editUser?.date_of_birth).utc(),
      })
    }
  }, [isEditingUser, form])

  const closeDrawer = () => {
    setEditUser(null)
    setIsDrawerOpen(false)
    setIsEditingUser(false)
    setIsManualActivation(false)
    form.resetFields()
  }

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      queryClient.setQueryData<InfiniteData<IViewUserDto[]>>(
        ['users', q],
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === 0 ? [newUser, ...page] : page,
            ),
          }
        },
      )
      closeDrawer()
      message.success('User updated successfully')
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<InfiniteData<IViewUserDto[]>>(
        ['users', q],
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.map((u: IViewUserDto) =>
                u.id === updatedUser.id ? updatedUser : u,
              ),
            ),
          }
        },
      )
      if (isCloseDrawerOnSuccess) closeDrawer()
      message.success('User updated successfully')
    },
  })

  const resendAccountVerificationEmailMutation = useMutation({
    mutationFn: sendAccountActivationEmail,
    onSuccess: () => {
      closeDrawer()
      message.success(`Activation email sent to ${editUser?.email}`)
    },
  })

  const forceActivateAccountMutation = useMutation({
    mutationFn: forceActivateAccount,
    onSuccess: () => {
      queryClient.setQueryData(
        ['users'],
        (oldUsers: IPaginatedFilterResponse<IViewUserDto[]>) => ({
          ...oldUsers,
          data: oldUsers.data.map((user) => {
            if (user.id === editUser?.id) {
              const updatedEditUser = {
                ...user,
                activated_at: new Date(),
              }
              setEditUser(updatedEditUser)
              return updatedEditUser
            }
            return user
          }),
        }),
      )
      message.success(`${editUser?.email} was activated`)
    },
  })

  const handleOnsubmit = (v: ICreateUserDto) => {
    if (!v.profile_image_url) v.profile_image_url = ''
    if (isEditingUser && editUser) {
      setIsCloseDrawerOnSuccess(true)
      updateUserMutation.mutate({ userId: editUser.id, formData: v })
    } else {
      createUserMutation.mutate(v)
    }
  }

  const disableFutureDates = (current: Dayjs | null): boolean => {
    return current !== null && current > dayjs().endOf('day')
  }

  const handleResendActivationEmail = () => {
    if (!editUser) {
      message.error('Activation email failed')
      return
    }
    if (editUser.activated_at) {
      message.error('User is already activated')
      return
    }
    if (isManualActivation) {
      forceActivateAccountMutation.mutate(editUser.id)
    } else {
      resendAccountVerificationEmailMutation.mutate(editUser.username)
    }
  }

  return (
    <>
      <div className="flex-1 flex justify-end">
        <Button
          className="item-right"
          size="large"
          icon={<UserAddOutlined />}
          onClick={() => setIsDrawerOpen(true)}
        />
      </div>
      <Drawer
        title={`${isEditingUser ? 'Edit' : 'Add'} User`}
        onClose={() => closeDrawer()}
        open={isDrawerOpen}
        extra={
          <Button hidden={isEditingUser} onClick={() => form.resetFields()}>
            Clear
          </Button>
        }
      >
        <Form
          size="large"
          form={form}
          onFinish={handleOnsubmit}
          title="AddEditUserForm"
          key={Math.random()}
        >
          <Form.Item name="profile_image_url">
            <AvatarUploader
              onUploaded={async ({ secure_url }) => {
                form.setFieldValue('profile_image_url', secure_url)
                if (editUser) {
                  updateUserMutation.mutate({
                    userId: editUser.id,
                    formData: { profile_image_url: secure_url },
                  })
                }
              }}
              defaultImageUrl={editUser?.profile_image_url}
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="username"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Input disabled={isEditingUser} placeholder="Username" />
          </Form.Item>

          <Form.Item>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item
                noStyle
                hasFeedback
                name="email"
                rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
              >
                <Input
                  placeholder="Email"
                  prefix={
                    isEditingUser && (
                      <Badge
                        color={editUser?.activated_at ? 'green' : 'orange'}
                      />
                    )
                  }
                />
              </Form.Item>

              {isEditingUser && (
                <Button
                  loading={
                    forceActivateAccountMutation.isPending ||
                    resendAccountVerificationEmailMutation.isPending
                  }
                  onClick={handleResendActivationEmail}
                >
                  {isManualActivation ? 'Activate' : 'Resend'}
                </Button>
              )}
            </Space.Compact>
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

          <Form.Item
            hasFeedback
            name="native_name"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Input placeholder="Native name" />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="phone"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Input placeholder="Phone" />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="wechatid"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Input placeholder="Wechat" />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="country_of_birth"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Input placeholder="Country of birth" />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="place_of_birth"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Input placeholder="Place of birth" />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="timezone"
            rules={[isEditingUser ? UpdateUserDtoRule : CreateUserDtoRule]}
          >
            <Select
              showSearch
              placeholder="Select a tinezone"
              optionFilterProp="label"
              options={timezones.map((timezone) => ({
                value: timezone.tzCode,
                label: timezone.label,
              }))}
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

          <Form.Item>
            {editUser && (
              <UserDeleteModel closeDrawer={closeDrawer} user={editUser} />
            )}
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

import { useEffect, useState } from 'react'
import { TeamOutlined } from '@ant-design/icons'
import {
  Button,
  Drawer,
  message,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  SelectProps,
  Spin,
} from 'antd'
import {
  CreateGroupDto,
  ICreateGroupDto,
  IGroupEntity,
  UpdateGroupDto,
} from 'entix-shared'
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { createGroup, updateGroup } from '@/api/client.api'
import { createSchemaFieldRule } from 'antd-zod'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import utc from 'dayjs/plugin/utc'
import { useSearchParams } from 'react-router-dom'
import { editGroupAtom, editGroupStatusAtom } from '@/store/group.atom'
import { GroupDeleteModel } from './GroupDeleteModel'
import { UserSearchSelect } from '../users/UserSearchSelect'
dayjs.extend(utc)

export const GroupAddEditForm = () => {
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCloseDrawerOnSuccess, setIsCloseDrawerOnSuccess] = useState(false)
  const [editGroup, setEditGroup] = useAtom(editGroupAtom)
  const [isEditingGroup, setIsEditingGroup] = useAtom(editGroupStatusAtom)
  const CreateGroupDtoRule = createSchemaFieldRule(CreateGroupDto)
  const UpdateGroupDtoRule = createSchemaFieldRule(UpdateGroupDto)
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams({
    q: '',
    sortBy: 'created_at:desc',
    limit: '10',
  })

  const q = searchParams.get('q') || ''

  useEffect(() => {
    if (isEditingGroup) {
      setIsDrawerOpen(true)
      form.setFieldsValue({
        ...editGroup,
        start_date: dayjs(editGroup?.start_date).utc(),
        end_date: dayjs(editGroup?.end_date).utc(),
        time: dayjs(editGroup?.time).utc(),
      })
    }
  }, [isEditingGroup, form])

  const closeDrawer = () => {
    setEditGroup(null)
    setIsDrawerOpen(false)
    setIsEditingGroup(false)
    form.resetFields()
  }

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: (newUser) => {
      queryClient.setQueryData<InfiniteData<IGroupEntity[]>>(
        ['groups', q],
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

  const updateGroupMutation = useMutation({
    mutationFn: updateGroup,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<InfiniteData<IGroupEntity[]>>(
        ['groups', q],
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.map((u: IGroupEntity) =>
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

  const handleOnsubmit = (v: ICreateGroupDto) => {
    if (isEditingGroup && editGroup) {
      setIsCloseDrawerOnSuccess(true)
      updateGroupMutation.mutate({ groupId: editGroup.id, formData: v })
    } else {
      createGroupMutation.mutate(v)
    }
  }

  return (
    <>
      <div className="flex-1 flex justify-end">
        <Button
          className="item-right"
          size="large"
          icon={<TeamOutlined />}
          onClick={() => setIsDrawerOpen(true)}
        />
      </div>
      <Drawer
        title={`${isEditingGroup ? 'Edit' : 'Add'} Group`}
        onClose={() => closeDrawer()}
        open={isDrawerOpen}
        extra={
          <Button hidden={isEditingGroup} onClick={() => form.resetFields()}>
            Clear
          </Button>
        }
      >
        <Form
          size="large"
          form={form}
          onFinish={handleOnsubmit}
          title="AddEditGroupForm"
          key={Math.random()}
        >
          <Form.Item
            hasFeedback
            name="name"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <Input placeholder="name" />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="description"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <Input.TextArea rows={4} placeholder="description" />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="user_ids"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <UserSearchSelect />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="duration"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <Select
              placeholder="Select duration"
              style={{ width: '100%' }}
              options={[
                { value: 30, label: '30 minutes' },
                { value: 45, label: '45 minutes' },
                { value: 60, label: '60 minutes' },
                { value: 90, label: '90 minutes' },
                { value: 120, label: '120 minutes' },
              ]}
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="time"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <TimePicker
              use12Hours
              minuteStep={5}
              hourStep={1}
              placeholder="Select time"
              style={{ width: '100%' }}
              format={'HH:mm'}
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="payment_plan_id"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <Select
              placeholder="Select payment plan"
              style={{ width: '100%' }}
              options={[
                { value: 1, label: 'Basic' },
                { value: 2, label: 'Silver' },
                { value: 3, label: 'Gold' },
                { value: 4, label: 'Primary' },
                { value: 5, label: 'Standard' },
              ]}
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="start_date"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Start date"
              allowClear={false}
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="end_date"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="End date"
              allowClear={false}
            />
          </Form.Item>

          <Form.Item hidden={isEditingGroup}>
            <Button
              loading={createGroupMutation.isPending}
              block
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>

          <Form.Item hidden={!isEditingGroup}>
            <Button
              loading={updateGroupMutation.isPending}
              block
              htmlType="submit"
            >
              Save
            </Button>
          </Form.Item>

          <Form.Item>
            {editGroup && (
              <GroupDeleteModel closeDrawer={closeDrawer} group={editGroup} />
            )}
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}
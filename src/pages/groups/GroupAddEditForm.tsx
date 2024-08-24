import { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { createSchemaFieldRule } from 'antd-zod'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import utc from 'dayjs/plugin/utc'
import { editGroupAtom, editGroupStatusAtom } from '@/store/group.atom'
import { GroupDeleteModel } from './GroupDeleteModel'
import {
  createGroup,
  getGroupUsers,
  updateGroup,
} from '@/api/clients/group.client'
import { CreateGroupDto, ICreateGroupDto, UpdateGroupDto } from 'entix-shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Drawer, message, Form, Input, Select, DatePicker } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { GroupUserSearchSelect } from './GroupUserSearchSelect'
dayjs.extend(utc)

export const GroupAddEditForm = () => {
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editGroup, setEditGroup] = useAtom(editGroupAtom)
  const [isEditingGroup, setIsEditingGroup] = useAtom(editGroupStatusAtom)
  const CreateGroupDtoRule = createSchemaFieldRule(
    CreateGroupDto.extend({
      userIds: z.array(z.coerce.number()).optional(),
    }),
  )
  const UpdateGroupDtoRule = createSchemaFieldRule(UpdateGroupDto)
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams({
    name: '',
    limit: '10',
  })

  const name = searchParams.get('name') || ''

  const groupUserQuery = useQuery({
    queryKey: ['group:users', editGroup?.id ?? -1],
    enabled: !!editGroup?.id,
    queryFn: getGroupUsers,
  })

  useEffect(() => {
    if (isEditingGroup) {
      setIsDrawerOpen(true)
      form.setFieldsValue({
        ...editGroup,
        userIds: groupUserQuery?.data?.map(({ id }) => id),
      })
    }
  }, [isEditingGroup, form, groupUserQuery?.data])

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setEditGroup(null)
    setIsEditingGroup(false)
    form.resetFields()
  }

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', { name }] })
      closeDrawer()
      message.success('User created successfully')
    },
  })

  const updateGroupMutation = useMutation({
    mutationFn: updateGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', { name }] })
      closeDrawer()
      message.success('User updated successfully')
    },
  })

  const handleOnsubmit = async (v: ICreateGroupDto) => {
    if (isEditingGroup && editGroup) {
      await updateGroupMutation.mutate({
        groupId: editGroup?.id,
        formData: v,
      })
    } else {
      await createGroupMutation.mutate(v)
    }
  }

  return (
    <>
      <div className="flex-1 flex justify-end">
        <Button
          className="item-right"
          size="large"
          icon={<PlusOutlined />}
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
            name="userIds"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <GroupUserSearchSelect
              groupId={editGroup?.id ?? 0}
              defaultOptions={groupUserQuery?.data ?? []}
            />
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
            name="startDate"
            normalize={(value) => (value ? dayjs(value) : undefined)}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : undefined,
            })}
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <DatePicker
              showHour
              showMinute
              minuteStep={5}
              showTime
              style={{ width: '100%' }}
              placeholder="Start date"
              allowClear={false}
            />
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

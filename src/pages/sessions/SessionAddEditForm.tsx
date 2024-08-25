import { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { createSchemaFieldRule } from 'antd-zod'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import utc from 'dayjs/plugin/utc'
import { editGroupAtom, editGroupStatusAtom } from '@/store/group.atom'
import { createGroup, updateGroup } from '@/api/clients/group.client'
import {
  CreateSessionDto,
  ICreateSessionDto,
  UpdateGroupDto,
} from 'entix-shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Drawer,
  message,
  Form,
  Input,
  Select,
  DatePicker,
  Divider,
} from 'antd'
import { useSearchParams } from 'react-router-dom'
import { GroupSearchSelect } from './GroupSearchSelect'
dayjs.extend(utc)

export const SessionAddEditForm = () => {
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editGroup, setEditGroup] = useAtom(editGroupAtom)
  const [isEditingGroup, setIsEditingGroup] = useAtom(editGroupStatusAtom)
  const CreateSessionDtoRule = createSchemaFieldRule(CreateSessionDto)
  const UpdateGroupDtoRule = createSchemaFieldRule(UpdateGroupDto)
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams({
    name: '',
    limit: '10',
  })
  const name = searchParams.get('name') || ''

  useEffect(() => {
    if (isEditingGroup) {
      setIsDrawerOpen(true)
      form.setFieldsValue({
        ...editGroup,
      })
    }
  }, [isDrawerOpen, form])

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setEditGroup(null)
    setIsEditingGroup(false)
    form.resetFields()
  }

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', { name }] })
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

  const handleOnsubmit = async (v: ICreateSessionDto) => {
    console.log(v)
    // if (isEditingGroup && editGroup) {
    //   await updateGroupMutation.mutate({
    //     groupId: editGroup?.id,
    //     formData: v,
    //   })
    // } else {
    //   await createGroupMutation.mutate(v)
    // }
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
        title={`${isEditingGroup ? 'Edit' : 'Add'} Session`}
        onClose={() => closeDrawer()}
        open={isDrawerOpen}
        extra={
          <Button hidden={isEditingGroup} onClick={() => form.resetFields()}>
            Clear
          </Button>
        }
      >
        <Form
          layout="vertical"
          size="large"
          form={form}
          onFinish={handleOnsubmit}
          title="AddEditGroupForm"
          key={Math.random()}
        >
          <Form.Item
            hasFeedback
            name="name"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateSessionDtoRule]}
          >
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="groupId"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateSessionDtoRule]}
          >
            <GroupSearchSelect groupId={editGroup?.id ?? 0} />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="description"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateSessionDtoRule]}
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
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateSessionDtoRule]}
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
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateSessionDtoRule]}
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
            name="futureSessionCount"
            initialValue={1}
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateSessionDtoRule]}
          >
            <Select
              placeholder="Future session count"
              style={{ width: '100%' }}
              options={[
                { value: 1, label: '1 session' },
                { value: 5, label: '5 session' },
                { value: 10, label: '10 session' },
                { value: 20, label: '20 session' },
                { value: 40, label: '40 session' },
                { value: 60, label: '60 session' },
                { value: 100, label: '100 session' },
              ]}
            />
          </Form.Item>

          <Divider dashed />

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

          {/* <Form.Item>
            {editGroup && (
              <GroupDeleteModel closeDrawer={closeDrawer} group={editGroup} />
            )}
          </Form.Item> */}
        </Form>
      </Drawer>
    </>
  )
}

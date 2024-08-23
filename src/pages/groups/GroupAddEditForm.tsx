import { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { createSchemaFieldRule } from 'antd-zod'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import utc from 'dayjs/plugin/utc'
import { editGroupAtom, editGroupStatusAtom } from '@/store/group.atom'
import { GroupDeleteModel } from './GroupDeleteModel'
import { createGroup, updateGroup } from '@/api/clients/group.client'
import { CreateGroupDto, ICreateGroupDto, UpdateGroupDto } from 'entix-shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Drawer,
  message,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
} from 'antd'
import { useSearchParams } from 'react-router-dom'
import { SelectSearch } from '@/components/Form/SelectSearch'
dayjs.extend(utc)

export const GroupAddEditForm = () => {
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editGroup, setEditGroup] = useAtom(editGroupAtom)
  const [isEditingGroup, setIsEditingGroup] = useAtom(editGroupStatusAtom)
  const CreateGroupDtoRule = createSchemaFieldRule(CreateGroupDto)
  const UpdateGroupDtoRule = createSchemaFieldRule(UpdateGroupDto)
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams({
    name: '',
    sortBy: 'created_at:desc',
    limit: '10',
  })

  const name = searchParams.get('name') || ''

  useEffect(() => {
    if (isEditingGroup) {
      setIsDrawerOpen(true)
      form.setFieldsValue(editGroup)
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', { name }] })
      closeDrawer()
      message.success('User updated successfully')
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
            name="users"
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <SelectSearch
              defaultOptions={[
                {
                  id: 246,
                  deletedAt: null,
                  createdAt: new Date('2024-06-20T15:42:06.000Z'),
                  updatedAt: new Date('2024-06-20T15:45:06.000Z'),
                  xid: 'fd050049-8c39-41bf-bd14-059e06055fc1',
                  username: 'kellyxu',
                  email: 'chen7david@me.com',
                  firstName: 'Kelly',
                  lastName: 'Xu',
                  dateOfBirth: new Date('2013-09-07T00:00:00.000Z'),
                  sex: 'm',
                  imageUrl:
                    'https://res.cloudinary.com/dbhdod0gm/image/upload/v1722174291/sgjvyx96oqlkrgl7bjdm.png',
                  phone: '',
                  wechat: '',
                  otherName: '',
                  countryOfBirth: 'China',
                  placeOfBirth: 'Changchun',
                  timezone: 'Asia/Shanghai',
                  activatedAt: null,
                },
                {
                  id: 245,
                  deletedAt: null,
                  createdAt: new Date('2024-05-15T14:59:59.000Z'),
                  updatedAt: new Date('2024-05-15T15:01:38.000Z'),
                  xid: '54c17b76-7cc1-44e1-a3e6-47a9ef4e1d53',
                  username: 'jakewang',
                  email: 'a@abc.com',
                  firstName: 'Jake',
                  lastName: 'Wang',
                  dateOfBirth: new Date('2019-03-04T00:00:00.000Z'),
                  sex: 'm',
                  imageUrl:
                    'https://res.cloudinary.com/dbhdod0gm/image/upload/v1722173541/loecqvtyodn154p1pvm6.png',
                  phone: '98237481723',
                  wechat: '',
                  otherName: '',
                  countryOfBirth: 'China',
                  placeOfBirth: 'Changchun',
                  timezone: 'Asia/Shanghai',
                  activatedAt: null,
                },
              ]}
            />
          </Form.Item>
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
            normalize={(value) =>
              value ? dayjs(value).format('HH:mm') : value
            }
            getValueProps={(value) => ({
              value: value ? dayjs(value, 'HH:mm') : value,
            })}
            rules={[isEditingGroup ? UpdateGroupDtoRule : CreateGroupDtoRule]}
          >
            <TimePicker
              use12Hours
              minuteStep={5}
              placeholder="Select time"
              style={{ width: '100%' }}
              format={'HH:mm'}
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="startDate"
            normalize={(value) => (value ? dayjs(value) : value)}
            getValueProps={(value) => ({ value: dayjs(value) })}
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
            name="endDate"
            normalize={(value) => (value ? dayjs(value) : value)}
            getValueProps={(value) => ({ value: dayjs(value) })}
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

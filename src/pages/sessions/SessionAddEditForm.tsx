import { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { createSchemaFieldRule } from 'antd-zod'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import utc from 'dayjs/plugin/utc'
import {
  CreateSessionDto,
  ICreateSessionDto,
  UpdateSessionDto,
} from 'entix-shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Drawer,
  message,
  Form,
  Select,
  DatePicker,
  Divider,
} from 'antd'
import { useSearchParams } from 'react-router-dom'
import { editSessionAtom, editSessionStatusAtom } from '@/store/session.atom'
import { createSession, updateSession } from '@/api/clients/session.client'
import { GroupSearchSelect } from './GroupSearchSelect'
import { SessionUserSearchSelect } from './SessionUserSearchSelect'
import { findSessionUsers } from '@/api/clients/user.client'
dayjs.extend(utc)

export const SessionAddEditForm = () => {
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editSession, setEditSession] = useAtom(editSessionAtom)
  const [isEditingSession, setIsEditingSession] = useAtom(editSessionStatusAtom)
  const CreateSessionDtoRule = createSchemaFieldRule(CreateSessionDto)
  const UpdateSessionDtoRule = createSchemaFieldRule(UpdateSessionDto)
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams({
    startDate: dayjs().utc().subtract(1, 'month').toISOString(),
    endDate: dayjs().utc().toISOString(),
    groupId: '',
    name: '',
    limit: '10',
  })
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setEditSession(null)
    setIsEditingSession(false)
    form.resetFields()
  }

  const sessionUsersQuery = useQuery({
    queryKey: ['session:users'],
    queryFn: () => findSessionUsers(editSession?.id || 0),
    enabled: !!editSession,
  })

  useEffect(() => {
    if (isEditingSession) {
      setIsDrawerOpen(true)
      form.setFieldsValue({
        ...editSession,
        userIds: sessionUsersQuery?.data?.map(({ id }) => id) || [],
      })
    }
  }, [isEditingSession, sessionUsersQuery?.data])

  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['session', { startDate, endDate }],
      })
      closeDrawer()
      message.success('User created successfully')
    },
  })

  const updateSessionMutation = useMutation({
    mutationFn: updateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', { name }] })
      closeDrawer()
      message.success('User updated successfully')
    },
  })

  const handleOnsubmit = async (v: ICreateSessionDto) => {
    console.log(v)
    if (isEditingSession && editSession) {
      await updateSessionMutation.mutate({
        sessionId: editSession?.id,
        formData: v,
      })
    } else {
      await createSessionMutation.mutate(v)
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
        title={`${isEditingSession ? 'Edit' : 'Add'} Session`}
        onClose={() => closeDrawer()}
        open={isDrawerOpen}
        extra={
          <Button hidden={isEditingSession} onClick={() => form.resetFields()}>
            Clear
          </Button>
        }
      >
        <Form
          layout="vertical"
          size="large"
          form={form}
          onFinish={handleOnsubmit}
          title="AddEditSessionForm"
          key={Math.random()}
        >
          <Form.Item
            hidden={editSession !== null}
            hasFeedback
            name="groupId"
            rules={[
              isEditingSession ? UpdateSessionDtoRule : CreateSessionDtoRule,
            ]}
          >
            <GroupSearchSelect />
          </Form.Item>

          {editSession && (
            <Form.Item
              hasFeedback
              name="userIds"
              rules={[
                isEditingSession ? UpdateSessionDtoRule : CreateSessionDtoRule,
              ]}
            >
              <SessionUserSearchSelect
                selectedOptions={sessionUsersQuery?.data || []}
                sessionId={editSession?.id}
              />
            </Form.Item>
          )}

          <Form.Item
            hasFeedback
            name="startDate"
            normalize={(value) => (value ? dayjs(value) : undefined)}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : undefined,
            })}
            rules={[
              isEditingSession ? UpdateSessionDtoRule : CreateSessionDtoRule,
            ]}
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
            name="futureSessionCount"
            rules={[
              isEditingSession ? UpdateSessionDtoRule : CreateSessionDtoRule,
            ]}
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

          <Form.Item hidden={isEditingSession}>
            <Button
              loading={createSessionMutation.isPending}
              block
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>

          <Form.Item hidden={!isEditingSession}>
            <Button
              loading={updateSessionMutation.isPending}
              block
              htmlType="submit"
            >
              Save
            </Button>
          </Form.Item>

          {/* <Form.Item>
            {editSession && (
              <SessionDeleteModel closeDrawer={closeDrawer} group={editSession} />
            )}
          </Form.Item> */}
        </Form>
      </Drawer>
    </>
  )
}

import { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { createSchemaFieldRule } from 'antd-zod'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import utc from 'dayjs/plugin/utc'
import { ReverseTransferDto, IReverseTransferDto } from 'entix-shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Drawer, message, Form, Input } from 'antd'
import { editPaymentAtom, editPaymentStatusAtom } from '@/store/payment.atom'
import { reversePayment } from '@/api/clients/payment.client'
dayjs.extend(utc)

export const PaymentAddEditForm = () => {
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editPayment, setEditPayment] = useAtom(editPaymentAtom)
  const [isEditingPayment, setIsEditingPayment] = useAtom(editPaymentStatusAtom)
  const ReverseTransferDtoRule = createSchemaFieldRule(ReverseTransferDto)
  const queryClient = useQueryClient()

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setEditPayment(null)
    setIsEditingPayment(false)
    form.resetFields()
  }

  useEffect(() => {
    if (isEditingPayment) {
      setIsDrawerOpen(true)
    }
  }, [isEditingPayment])

  const reversePaymentMutation = useMutation({
    mutationFn: reversePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', { name }] })
      closeDrawer()
      message.success('User updated successfully')
    },
  })

  const handleOnsubmit = async (v: IReverseTransferDto) => {
    console.log(v)
    reversePaymentMutation.mutate(v)
  }

  console.log(editPayment)
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
        title={`${isEditingPayment ? 'Edit' : 'Add'} Payment`}
        onClose={() => closeDrawer()}
        open={isDrawerOpen}
        extra={
          <Button hidden={isEditingPayment} onClick={() => form.resetFields()}>
            Clear
          </Button>
        }
      >
        <Form
          layout="vertical"
          size="large"
          form={form}
          onFinish={handleOnsubmit}
          title="AddEditPaymentForm"
          key={Math.random()}
        >
          <Form.Item
            initialValue={editPayment?.trxid}
            hasFeedback
            name="trxid"
            rules={[ReverseTransferDtoRule]}
          >
            <Input disabled placeholder="trxid" />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="description"
            rules={[ReverseTransferDtoRule]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Write description for the effected recipients"
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="password"
            rules={[ReverseTransferDtoRule]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={reversePaymentMutation.isPending}
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

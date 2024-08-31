import { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Drawer, message, Form, Input } from 'antd'
import {
  CreatePaymentPlanDto,
  ICreatePaymentPlanDto,
  UpdatePaymentPlanDto,
} from 'entix-shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSchemaFieldRule } from 'antd-zod'
import { useAtom } from 'jotai'
import { useSearchParams } from 'react-router-dom'
import {
  createPaymentPlan,
  updatePaymentPlan,
} from '@/api/clients/paymentplans.client'
import {
  editPaymentPlanAtom,
  editPaymentPlanStatusAtom,
} from '@/store/paymentplan.atom'

export const PaymentPlanAddEditForm = () => {
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCloseDrawerOnSuccess, setIsCloseDrawerOnSuccess] = useState(false)
  const [editPaymentPlan, setEditPaymentPlan] = useAtom(editPaymentPlanAtom)
  const [isEditingPaymentPlan, setIsEditingPaymentPlan] = useAtom(
    editPaymentPlanStatusAtom,
  )
  const CreatePaymentPlanDtoRule = createSchemaFieldRule(CreatePaymentPlanDto)
  const UpdatePaymentPlanDtoRule = createSchemaFieldRule(UpdatePaymentPlanDto)
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams({
    name: '',
    sortBy: 'created_at:desc',
    limit: '10',
  })

  const name = searchParams.get('name') || ''

  useEffect(() => {
    if (isEditingPaymentPlan) {
      setIsDrawerOpen(true)
      form.setFieldsValue(editPaymentPlan)
    }
  }, [isEditingPaymentPlan, form])

  const closeDrawer = () => {
    setEditPaymentPlan(null)
    setIsDrawerOpen(false)
    setIsEditingPaymentPlan(false)
    form.resetFields()
  }

  const createPaymentPlanMutation = useMutation({
    mutationFn: createPaymentPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', { name }] })
      closeDrawer()
      message.success('PaymentPlan updated successfully')
    },
  })

  const updatePaymentPlanMutation = useMutation({
    mutationFn: updatePaymentPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', { name }] })
      if (isCloseDrawerOnSuccess) closeDrawer()
      message.success('PaymentPlan updated successfully')
    },
  })

  const handleOnsubmit = (v: ICreatePaymentPlanDto) => {
    if (isEditingPaymentPlan && editPaymentPlan) {
      setIsCloseDrawerOnSuccess(true)
      updatePaymentPlanMutation.mutate({
        id: editPaymentPlan.id,
        updatePaymentPlanDto: v,
      })
    } else {
      createPaymentPlanMutation.mutate(v)
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
        title={`${isEditingPaymentPlan ? 'Edit' : 'Add'} PaymentPlan`}
        onClose={() => closeDrawer()}
        open={isDrawerOpen}
        extra={
          <Button
            hidden={isEditingPaymentPlan}
            onClick={() => form.resetFields()}
          >
            Clear
          </Button>
        }
      >
        <Form
          size="large"
          form={form}
          onFinish={handleOnsubmit}
          title="AddEditPaymentPlanForm"
          key={Math.random()}
        >
          <Form.Item
            hasFeedback
            name="name"
            rules={[
              isEditingPaymentPlan
                ? UpdatePaymentPlanDtoRule
                : CreatePaymentPlanDtoRule,
            ]}
          >
            <Input disabled={isEditingPaymentPlan} placeholder="name" />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="one"
            rules={[
              isEditingPaymentPlan
                ? UpdatePaymentPlanDtoRule
                : CreatePaymentPlanDtoRule,
            ]}
          >
            <Input
              type="number"
              prefix="￥"
              suffix="RMB"
              placeholder="one on one"
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="two"
            rules={[
              isEditingPaymentPlan
                ? UpdatePaymentPlanDtoRule
                : CreatePaymentPlanDtoRule,
            ]}
          >
            <Input
              type="number"
              prefix="￥"
              suffix="RMB"
              placeholder="two students"
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="three"
            rules={[
              isEditingPaymentPlan
                ? UpdatePaymentPlanDtoRule
                : CreatePaymentPlanDtoRule,
            ]}
          >
            <Input
              type="number"
              prefix="￥"
              suffix="RMB"
              placeholder="three students"
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="four"
            rules={[
              isEditingPaymentPlan
                ? UpdatePaymentPlanDtoRule
                : CreatePaymentPlanDtoRule,
            ]}
          >
            <Input
              type="number"
              prefix="￥"
              suffix="RMB"
              placeholder="four students"
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="five"
            rules={[
              isEditingPaymentPlan
                ? UpdatePaymentPlanDtoRule
                : CreatePaymentPlanDtoRule,
            ]}
          >
            <Input
              type="number"
              prefix="￥"
              suffix="RMB"
              placeholder="five students"
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="six"
            rules={[
              isEditingPaymentPlan
                ? UpdatePaymentPlanDtoRule
                : CreatePaymentPlanDtoRule,
            ]}
          >
            <Input
              type="number"
              prefix="￥"
              suffix="RMB"
              placeholder="six students"
            />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="seven"
            rules={[
              isEditingPaymentPlan
                ? UpdatePaymentPlanDtoRule
                : CreatePaymentPlanDtoRule,
            ]}
          >
            <Input
              type="number"
              prefix="￥"
              suffix="RMB"
              placeholder="seven students"
            />
          </Form.Item>

          <Form.Item hidden={isEditingPaymentPlan}>
            <Button
              loading={createPaymentPlanMutation.isPending}
              block
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>

          <Form.Item hidden={!isEditingPaymentPlan}>
            <Button
              loading={updatePaymentPlanMutation.isPending}
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

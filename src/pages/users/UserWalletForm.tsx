import { useEffect, useState } from 'react'
import { LockOutlined } from '@ant-design/icons'
import { Button, Drawer, Select, message, Form, Input, InputNumber } from 'antd'
import { CurrencyType } from 'entix-shared'
import { useMutation } from '@tanstack/react-query'
import { getUserCnyBalance, makeTransfer } from '@/api/client.api'
import { createSchemaFieldRule } from 'antd-zod'
import dayjs from 'dayjs'
import { editUserAtom, manageWalletStatusAtom } from '@/store/update.atom'
import { useAtom } from 'jotai'
import utc from 'dayjs/plugin/utc'
import { UserAvatar } from './UserAvatar'
import { z } from 'zod'
import { currUserAtom } from '@/store/auth.atom'
import { MoneyBadge } from '@/components/MoneyBadge'
dayjs.extend(utc)

const PartialTransferDetails = z.object({
  transferType: z.enum(['deposit', 'withdraw']),
  password: z.string().min(8),
  amount: z.number(),
})

type IPartialTransferDetails = z.infer<typeof PartialTransferDetails>

export const UserWalletForm = () => {
  const [editUser, setEditUser] = useAtom(editUserAtom)
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currUser] = useAtom(currUserAtom)
  const [isManageWallet, setIsManageWallet] = useAtom(manageWalletStatusAtom)
  const PartialTransferDetailsRule = createSchemaFieldRule(
    PartialTransferDetails,
  )

  const userCnyBalanceMutation = useMutation({
    mutationFn: getUserCnyBalance,
  })

  const makeTransferMutation = useMutation({
    mutationFn: makeTransfer,
    onSuccess: () => {
      message.success('Transfer completed')
      closeDrawer()
    },
  })

  useEffect(() => {
    if (isManageWallet) setIsDrawerOpen(true)
    if (editUser) userCnyBalanceMutation.mutate({ userId: editUser.id })
  }, [isManageWallet, form])

  const closeDrawer = () => {
    setEditUser(null)
    setIsDrawerOpen(false)
    setIsManageWallet(false)
    form.resetFields()
  }

  const handleOnsubmit = ({
    transferType,
    amount,
    password,
  }: IPartialTransferDetails) => {
    if (!editUser || !currUser) return
    if (editUser.id === currUser.id) {
      message.warning('Transfers to yourself are not supported')
      closeDrawer()
      return
    }
    const data = {
      amount: amount,
      senderId: transferType === 'deposit' ? currUser.id : editUser.id,
      recipientId: transferType === 'withdraw' ? currUser.id : editUser.id,
      currencyType: CurrencyType.ChineseYuan,
      password,
    }
    console.log(data)
    makeTransferMutation.mutate(data)
  }

  return (
    <Drawer
      title={`${editUser?.firstName} ${editUser?.lastName}`}
      onClose={() => closeDrawer()}
      open={isDrawerOpen}
      extra={
        editUser && (
          <div className=" flex w-48 justify-between items-center">
            <UserAvatar user={editUser} />
            <MoneyBadge
              balance={userCnyBalanceMutation.data?.balance}
              currency="JPY"
              decimals={2}
            />
          </div>
        )
      }
    >
      <Form
        size="large"
        form={form}
        onFinish={handleOnsubmit}
        title="Manage Wallet"
        key={Math.random()}
        initialValues={{ transferType: 'deposit' }}
      >
        <Form.Item
          hasFeedback
          name="transferType"
          rules={[PartialTransferDetailsRule]}
        >
          <Select
            defaultValue={'deposit'}
            showSearch
            placeholder="Select a tinezone"
            optionFilterProp="label"
            options={[
              {
                value: 'deposit',
                label: 'Deposit (存款)',
              },
              {
                value: 'withdraw',
                label: 'Withdrawl (取款)',
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          hasFeedback
          rules={[PartialTransferDetailsRule]}
        >
          <InputNumber
            prefix="￥"
            type="number"
            placeholder="Amount"
            style={{ width: '100%' }}
            step={0.01}
          />
        </Form.Item>
        <Form.Item
          hasFeedback
          name="password"
          rules={[PartialTransferDetailsRule]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button
            loading={makeTransferMutation.isPending}
            block
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

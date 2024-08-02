import { useEffect, useState } from 'react'
import { LockOutlined } from '@ant-design/icons'
import {
  Button,
  Drawer,
  Select,
  message,
  Form,
  Input,
  InputNumber,
  Badge,
} from 'antd'
import { CurrencyType, IViewUserDto } from 'entix-shared'
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { createUser, getUserCnyBalance, makeTransfer } from '@/api/client.api'
import { createSchemaFieldRule } from 'antd-zod'
import dayjs from 'dayjs'
import { editUserAtom, manageWalletStatusAtom } from '@/store/update.atom'
import { useAtom } from 'jotai'
import utc from 'dayjs/plugin/utc'
import { UserAvatar } from './UserAvatar'
import { z } from 'zod'
import { currUserAtom } from '@/store/auth.atom'
dayjs.extend(utc)

const PartialTransferDetails = z.object({
  transfer_type: z.enum(['deposit', 'withdraw']),
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
  const queryClient = useQueryClient()

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
      message.success('transfer completed')
    },
  })

  const handleOnsubmit = ({
    transfer_type,
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
      sender_id: transfer_type === 'deposit' ? currUser.id : editUser.id,
      recipient_id: transfer_type === 'withdraw' ? currUser.id : editUser.id,
      currency_type: CurrencyType.ChineseYuan,
      password,
    }
    console.log(data)
    makeTransferMutation.mutate(data)
  }

  return (
    <Drawer
      title={`${editUser?.first_name} ${editUser?.last_name}`}
      onClose={() => closeDrawer()}
      open={isDrawerOpen}
      extra={
        editUser && (
          <div className=" flex w-48 justify-between items-center">
            <UserAvatar user={editUser} />
            <Badge
              color="#374151"
              count={new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'CNY',
              }).format(userCnyBalanceMutation.data?.balance || 0)}
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
        initialValues={{ transfer_type: 'deposit' }}
      >
        <Form.Item
          hasFeedback
          name="transfer_type"
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
            loading={createUserMutation.isPending}
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

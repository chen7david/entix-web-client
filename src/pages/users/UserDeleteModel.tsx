import { useState } from 'react'
import { Button, Modal, message } from 'antd'
import { IUser } from 'entix-shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { currUserAtom } from '@/store/auth.atom'
import { deleteUser } from '@/api/client.api'
import { useSearchParams } from 'react-router-dom'

export type IUserDeleteModelProps = {
  user: IUser
  closeDrawer: () => void
}

export const UserDeleteModel = ({
  user,
  closeDrawer,
}: IUserDeleteModelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currUser] = useAtom(currUserAtom)
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams({
    firstName: '',
    limit: '10',
  })

  const firstName = searchParams.get('firstName') || ''

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', { firstName }] })
      closeDrawer()
      message.success('User deleted successfully')
    },
    onError: () => {
      message.error('Failed to delete user')
    },
  })

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    if (!currUser) {
      message.error('Please login to delete user')
      return
    }
    if (user.id === currUser.id) {
      message.warning('You cannot delete yourself!')
      return
    }
    await deleteUserMutation.mutate(user.id)
  }

  return (
    <>
      <Button block style={{ color: 'red' }} onClick={showModal}>
        Delete
      </Button>
      <Modal
        title="Delete Confirmation"
        open={isModalOpen}
        onOk={handleOk}
        okText="Delete"
        okType="danger"
        okButtonProps={{
          loading: deleteUserMutation.isPending,
        }}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>
          Are you sure you want to delete{' '}
          <span className="font-bold text-red-600">{user.username}</span>?
        </p>
      </Modal>
    </>
  )
}

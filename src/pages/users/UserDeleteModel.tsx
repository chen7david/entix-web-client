import { useState } from 'react'
import { Button, Modal, message } from 'antd'
import { IPaginatedFilterResponse, IViewUserDto } from 'entix-shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { currUserAtom } from '@/store/auth.atom'
import { deleteUser } from '@/api/client.api'

export type IUserDeleteModelProps = {
  user: IViewUserDto
}

export const UserDeleteModel = ({ user }: IUserDeleteModelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currUser] = useAtom(currUserAtom)
  const queryClient = useQueryClient()

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: (userId) => {
      queryClient.setQueryData(
        ['users'],
        (oldUsers: IPaginatedFilterResponse<IViewUserDto[]>) => {
          return {
            ...oldUsers,
            data: oldUsers.data.filter((u) => u.id !== userId),
          }
        },
      )
    },
    onSuccess: () => {
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
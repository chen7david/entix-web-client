import { useState } from 'react'
import { Button, Modal, message } from 'antd'
import { IUser } from 'entix-shared'
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { currUserAtom } from '@/store/auth.atom'
import { deleteUser } from '@/api/client.api'

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

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: (userId) => {
      queryClient.setQueryData<InfiniteData<IUser[]>>(['users'], (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.filter((u) => u.id !== userId),
          ),
        }
      })
    },
    onSuccess: () => {
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

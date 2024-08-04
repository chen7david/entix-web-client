import { useState } from 'react'
import { Button, Modal, message } from 'antd'
import { IGroupEntity } from 'entix-shared'
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { deleteGroup } from '@/api/client.api'

export type IGroupDeleteModelProps = {
  group: IGroupEntity
  closeDrawer: () => void
}

export const GroupDeleteModel = ({
  group,
  closeDrawer,
}: IGroupDeleteModelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onMutate: (groupId) => {
      queryClient.setQueryData<InfiniteData<IGroupEntity[]>>(
        ['groups', ''],
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.filter((item) => item.id !== groupId),
            ),
          }
        },
      )
    },
    onSuccess: () => {
      closeDrawer()
      message.success('Group deleted successfully')
    },
    onError: () => {
      message.error('Failed to delete group')
    },
  })

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    await deleteGroupMutation.mutate(group.id)
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
          loading: deleteGroupMutation.isPending,
        }}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>
          Are you sure you want to delete{' '}
          <span className="font-bold text-red-600">{group.name}</span>?
        </p>
      </Modal>
    </>
  )
}

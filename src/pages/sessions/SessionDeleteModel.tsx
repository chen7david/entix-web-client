import { useState } from 'react'
import { Button, Modal, message } from 'antd'
import { IGroupEntity } from 'entix-shared'
import { deleteGroup } from '@/api/clients/group.client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

export type ISessionDeleteModelProps = {
  group: IGroupEntity
  closeDrawer: () => void
}

export const SessionDeleteModel = ({
  group,
  closeDrawer,
}: ISessionDeleteModelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams({
    name: '',
    limit: '10',
  })

  const name = searchParams.get('name') || ''

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', { name }] })
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

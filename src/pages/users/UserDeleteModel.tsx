import { useState } from 'react'
import { Button, Modal, message } from 'antd'
import { IViewUserDto } from 'entix-shared'

export type IUserDeleteModelProps = {
  onSubmit: (formData: IViewUserDto) => Promise<void>
  user: IViewUserDto
}

export const UserDeleteModel = ({ onSubmit, user }: IUserDeleteModelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    await onSubmit(user)
    setIsModalOpen(false)
    message.success('User deleted successfully')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <Button onClick={showModal}>Delete</Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete {user.username}?</p>
      </Modal>
    </>
  )
}

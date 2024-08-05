import { filterUsers } from '@/api/client.api'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Select, SelectProps, Spin } from 'antd'
import { IGroupUserModel, IGroupWithUsersModel } from 'entix-shared'
import { debounce } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

interface IUserSearchSelectProps {
  value?: string[] // An array of user IDs
  onChange?: (value: string[]) => void // A function that accepts an array of user IDs
  isUpdating: boolean
  editGroup: IGroupWithUsersModel
  setSelectedIds: (selected: SelectProps['options']) => void
}

const SelectetUserWithAvatar = ({ user }: { user: IGroupUserModel }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Avatar
      size={20}
      src={user.profile_image_url}
      style={{
        backgroundColor: user?.sex == 'male' ? '#3291a8' : '#cc233f',
      }}
    >
      {user.first_name[0]}
    </Avatar>
    <span style={{ marginLeft: 8 }}>
      {`${user.first_name} ${user.last_name}`}
    </span>
  </div>
)

export const UserSearchSelect = ({
  value,
  onChange,
  isUpdating,
  editGroup,
  setSelectedIds,
}: IUserSearchSelectProps) => {
  const [q, setSearch] = useState('')
  const options: SelectProps['options'] = []

  const userSearchQuery = useQuery({
    queryKey: ['users', { q }],
    queryFn: filterUsers,
    enabled: !!q,
  })

  useEffect(() => {
    console.log('ran useEffect')
    if (editGroup) {
      const selected: SelectProps['options'] = []
      editGroup.users.map((user) => {
        selected.push({
          key: user.id,
          value: user.id,
          label: <SelectetUserWithAvatar user={user} />,
        })
      })
      setSelectedIds(selected)
    }
  }, [isUpdating])

  userSearchQuery?.data?.map((user) => {
    options.push({
      key: user.id,
      value: user.id,
      label: <SelectetUserWithAvatar user={user} />,
    })
  })

  const debouncedSearch = useMemo(() => debounce(setSearch, 300), [])

  return (
    <>
      <Select
        mode="multiple"
        allowClear
        value={value}
        onChange={onChange}
        placeholder="Select students"
        filterOption={false}
        labelInValue
        onSearch={debouncedSearch}
        showSearch={true}
        notFoundContent={
          userSearchQuery.isLoading ? <Spin size="small" /> : null
        }
        options={options}
        optionLabelProp="label"
      />
    </>
  )
}

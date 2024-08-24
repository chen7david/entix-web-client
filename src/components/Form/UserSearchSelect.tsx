import { filterUsers } from '@/api/clients/user.client'
import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps, Spin } from 'antd'
import { IGroup } from 'entix-shared'
import { debounce } from 'lodash'
import { useMemo, useState } from 'react'

interface IUserGroupUserSearchSelectProps {
  value?: string[] // An array of user IDs
  onChange?: (value: string[]) => void // A function that accepts an array of user IDs
  isUpdating: boolean
  editGroup: IGroup
  setSelectedIds: (selected: SelectProps['options']) => void
}

export const UserGroupUserSearchSelect = ({
  value,
  onChange,
  //   isUpdating,
  //   editGroup,
  //   setSelectedIds,
}: IUserGroupUserSearchSelectProps) => {
  const [name, setSearch] = useState('')
  const options: SelectProps['options'] = []

  const userSearchQuery = useQuery({
    queryKey: ['users', { name }],
    queryFn: filterUsers,
    enabled: !!name,
  })

  //   useEffect(() => {
  //     console.log('ran useEffect')
  //     if (editGroup) {
  //       const selected: SelectProps['options'] = []
  //       editGroup.users.map((user) => {
  //         selected.push({
  //           key: user.id,
  //           value: user.id,
  //           label: <SelectetUserWithAvatar user={user} />,
  //         })
  //       })
  //       setSelectedIds(selected)
  //     }
  //   }, [isUpdating])

  //   userSearchQuery?.data?.map((user) => {
  //     options.push({
  //       key: user.id,
  //       value: user.id,
  //       label: <SelectetUserWithAvatar user={user} />,
  //     })
  //   })

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

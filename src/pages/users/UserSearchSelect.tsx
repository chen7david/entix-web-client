import { filterUsers } from '@/api/client.api'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Select, SelectProps, Spin } from 'antd'
import { debounce } from 'lodash'
import { useMemo, useState } from 'react'

export const UserSearchSelect = () => {
  const [q, setSearch] = useState('')
  const options: SelectProps['options'] = []

  const userSearchQuery = useQuery({
    queryKey: ['users', { q }],
    queryFn: filterUsers,
    enabled: !!q,
  })

  userSearchQuery?.data?.map((user) => {
    options.push({
      value: user.id,
      label: (
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
          <span
            style={{ marginLeft: 8 }}
          >{`${user.first_name} ${user.last_name}`}</span>
        </div>
      ),
    })
  })

  const debouncedSearch = useMemo(() => debounce(setSearch, 300), [])

  return (
    <>
      <Select
        mode="multiple"
        allowClear
        labelInValue
        placeholder="Select students"
        filterOption={false}
        onSearch={debouncedSearch}
        showSearch={true}
        notFoundContent={
          userSearchQuery.isLoading ? <Spin size="small" /> : null
        }
        options={options}
      />
    </>
  )
}

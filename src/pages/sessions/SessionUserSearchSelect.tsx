import {
  relateSessionUser,
  unRelateSessionUser,
} from '@/api/clients/session.client'
import { findUsers } from '@/api/clients/user.client'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Select, SelectProps, Spin } from 'antd'
import { IUser } from 'entix-shared'
import { useEffect, useState } from 'react'

export type ISessionUserSearchSelectProps = {
  value?: string[]
  onChange?: (value: string[]) => void
  sessionId: number
  selectedOptions: IUser[]
}

function SelectetUserWithAvatar({ user }: { user: IUser }) {
  return (
    <div className="flex items-center gap-1">
      <Avatar
        style={{
          backgroundColor: user?.sex == 'm' ? '#3291a8' : '#cc233f',
        }}
        size={24}
        src={user.imageUrl}
      >
        <span>{user.firstName[0]}</span>
      </Avatar>
      <span>{user.firstName}</span>
    </div>
  )
}

function mapUserToSelectOption(user: IUser) {
  return {
    value: user.id,
    key: user.id,
    label: <SelectetUserWithAvatar user={user} />,
  }
}

export const SessionUserSearchSelect = ({
  onChange,
  value,
  sessionId,
  selectedOptions,
}: ISessionUserSearchSelectProps) => {
  const [firstName, setSearch] = useState('')
  const [options, setOptions] = useState<SelectProps['options']>([])

  const userSearchQuery = useQuery({
    queryKey: ['users:search', { firstName }],
    queryFn: () =>
      findUsers({ pageParam: null, searchParams: { firstName, limit: 10 } }),
    enabled: !!firstName,
  })

  // const sessionUsersQuery = useQuery({
  //   queryKey: ['session:users'],
  //   queryFn: () => findSessionUsers(sessionId),
  // })

  const formatedOptions = selectedOptions.map(mapUserToSelectOption)

  useEffect(() => {
    setOptions(formatedOptions)
  }, [selectedOptions])

  useEffect(() => {
    if (userSearchQuery.data) {
      const searchResults = userSearchQuery.data.items.map(
        mapUserToSelectOption,
      )
      setOptions((prevOptions = []) => [
        ...prevOptions,
        ...searchResults.filter(
          (result) =>
            !prevOptions?.some((option) => option.value === result.value),
        ),
      ])
    }
  }, [userSearchQuery.data])

  const handleChange = async (selectedValues: SelectProps['value']) => {
    const newValues = selectedValues as string[]
    if (onChange) onChange(newValues)

    if (!sessionId) return
    const oldValues = value ?? []

    const [addedId] = newValues.filter((value) => !oldValues.includes(value))
    if (addedId) await relateSessionUser({ sessionId, userId: addedId })

    const [removedId] = oldValues.filter((value) => !newValues.includes(value))
    if (removedId) await unRelateSessionUser({ sessionId, userId: removedId })
  }

  const onSearch = async (v: string) => {
    setSearch(v)
    console.log(v)
  }

  return (
    <Select
      placeholder="Students"
      style={{ width: '100%' }}
      value={value}
      options={options}
      onChange={handleChange}
      onSearch={onSearch}
      mode="multiple"
      allowClear
      showSearch
      filterOption={false}
      notFoundContent={userSearchQuery.isLoading ? <Spin size="small" /> : null}
      optionLabelProp="label"
    />
  )
}

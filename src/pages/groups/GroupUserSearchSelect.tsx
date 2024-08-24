import { relateGroupUser, unRelateGroupUser } from '@/api/clients/group.client'
import { findUsers } from '@/api/clients/user.client'
import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps, Spin } from 'antd'
import { IUser } from 'entix-shared'
import { useEffect, useState } from 'react'

export type IGroupUserSearchSelectProps = {
  value?: string[]
  onChange?: (value: string[]) => void
  defaultOptions: IUser[]
  groupId?: number
}

function mapUserToSelectOption({ id, firstName, lastName }: IUser) {
  return {
    value: id,
    label: `${firstName} ${lastName}`,
    key: id,
  }
}

export const GroupUserSearchSelect = ({
  defaultOptions,
  onChange,
  value,
  groupId,
}: IGroupUserSearchSelectProps) => {
  const [firstName, setSearch] = useState('')
  const [options, setOptions] = useState<SelectProps['options']>([])
  const formatedOptions = defaultOptions.map(mapUserToSelectOption)

  const userSearchQuery = useQuery({
    queryKey: ['users', { firstName }],
    queryFn: () =>
      findUsers({ pageParam: null, searchParams: { firstName, limit: 10 } }),
    enabled: !!firstName,
  })

  useEffect(() => {
    setOptions(formatedOptions)
  }, [defaultOptions, firstName])

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

    if (!groupId) return
    const oldValues = value ?? []

    const [addedId] = newValues.filter((value) => !oldValues.includes(value))
    if (addedId) await relateGroupUser({ groupId, userId: addedId })

    const [removedId] = oldValues.filter((value) => !newValues.includes(value))
    if (removedId) await unRelateGroupUser({ groupId, userId: removedId })
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

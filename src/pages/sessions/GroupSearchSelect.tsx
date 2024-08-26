import { findGroups } from '@/api/clients/group.client'
import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps, Spin } from 'antd'
import { useEffect, useState } from 'react'

export type IGroupSearchSelectProps = {
  value?: string
  onChange?: (value: string) => void
  groupId?: number
}

export const GroupSearchSelect = ({
  onChange,
  value,
  // groupId,
}: IGroupSearchSelectProps) => {
  const [name, setName] = useState('')
  const [options, setOptions] = useState<SelectProps['options']>([])

  const groupSearchQuery = useQuery({
    queryKey: ['groups:search', { name }],
    queryFn: () =>
      findGroups({ pageParam: null, searchParams: { name, limit: 10 } }),
    enabled: !!name,
  })

  useEffect(() => {
    if (groupSearchQuery.data) {
      const searchResults = groupSearchQuery.data.items.flat().map((group) => ({
        value: group.id,
        key: group.id,
        label: group.name,
      }))
      setOptions((prevOptions = []) => [
        ...prevOptions,
        ...searchResults.filter(
          (result) =>
            !prevOptions?.some((option) => option.value === result.value),
        ),
      ])
    }
  }, [groupSearchQuery.data])

  const handleChange = async (selectedValues: SelectProps['value']) => {
    const newValues = selectedValues as string
    if (onChange) onChange(newValues)

    // if (!groupId && !value) return
    // const oldValues = value

    // const [addedId] = newValues.filter((value) => !oldValues.includes(value))
    // if (addedId) await relateGroupUser({ groupId, userId: addedId })

    // const [removedId] = oldValues.filter((value) => !newValues.includes(value))
    // if (removedId) await unRelateGroupUser({ groupId, userId: removedId })
  }

  const onSearch = async (v: string) => {
    setName(v)
    console.log(v)
  }

  return (
    <Select
      placeholder="Groups"
      style={{ width: '100%' }}
      value={value}
      options={options}
      onChange={handleChange}
      onSearch={onSearch}
      allowClear
      showSearch
      filterOption={false}
      notFoundContent={
        groupSearchQuery.isLoading ? <Spin size="small" /> : null
      }
      optionLabelProp="label"
    />
  )
}

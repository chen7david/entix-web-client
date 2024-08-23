import { Select, SelectProps } from 'antd'
import { IUser } from 'entix-shared'
import { useEffect, useState } from 'react'

export type ISelectSearchProps = {
  defaultOptions: IUser[]
}

export const SelectSearch = ({ defaultOptions }: ISelectSearchProps) => {
  const [options, setOptions] = useState<SelectProps['options']>()
  const formatedOptions = defaultOptions.map(({ id, firstName, lastName }) => ({
    value: id,
    label: `${firstName} ${lastName}`,
  }))
  useEffect(() => {
    setOptions(formatedOptions)
  }, [defaultOptions])

  return (
    <Select
      placeholder="Students"
      style={{ width: '100%' }}
      defaultValue={formatedOptions.map(({ value }) => value)}
      options={options}
      onChange={console.log}
      onSearch={console.log}
      mode="multiple"
      allowClear
      showSearch
    />
  )
}

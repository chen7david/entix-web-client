import React, { ChangeEvent } from 'react'
import { Input as AntInput } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

export type IInputProps = {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  error: string | undefined
}

export const Input = ({ label, name, value, onChange, error }: IInputProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <AntInput
        allowClear
        size="large"
        placeholder={label}
        name={name}
        value={value}
        onChange={onChange}
        status={error ? 'error' : ''}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
}

export const InputPassword = ({
  label,
  name,
  value,
  onChange,
  error,
}: IInputProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <AntInput.Password
        allowClear
        placeholder={label}
        size="large"
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
        name={name}
        value={value}
        onChange={onChange}
        status={error ? 'error' : ''}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
}

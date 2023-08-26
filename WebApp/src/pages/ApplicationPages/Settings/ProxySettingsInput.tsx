import React from 'react'
import { Input, Select } from 'antd'

const { Option } = Select;

type propsType = {
  title: string,
}

export const ProxySettingsInput = ({title}: propsType) => {
  const selectBefore = (
    <Select defaultValue="http://">
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  )

  const selectAfter = (
    <Select defaultValue=".com">
      <Option value=".com">.com</Option>
      <Option value=".jp">.jp</Option>
      <Option value=".cn">.cn</Option>
      <Option value=".org">.org</Option>
    </Select>
  )

  return (
    <div className="flex flex-col gap-2">
      <p style={{ margin: '0 0' }}>{title}</p>
      <Input size='large' addonBefore={selectBefore} addonAfter={selectAfter} placeholder={title} />
    </div>
  )
}

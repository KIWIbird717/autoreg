import React from 'react'
import { Cascader, InputNumber, Popover, Statistic, Typography } from 'antd'
import { InfoCircleOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { colors } from '../../../global-style/style-colors.module'

const { Title } = Typography

export const Start = () => {
  return (
    <div className="w-full flex gap-5 mb-5">
      <div className="w-full flex flex-col gap-1">
        <div className="flex gap-2 items-center">
          <Title level={5} style={{ margin: '0 0' }}>Папка</Title>
        </div>
        <Cascader placeholder="Папка" size='large' className='w-full'/>
      </div>

      <div className="w-full flex flex-col gap-1">
        <div className="flex gap-2 items-center">
          <Title level={5} style={{ margin: '0 0' }}>Кол-во аккаунтов</Title>
          <Popover className='cursor-pointer' title="Кол-во аккаунтов" content='Тут может быть описание кол-ва аккаунтов'>
            <InfoCircleOutlined />
          </Popover>
        </div>
        <InputNumber size='large' defaultValue={0} min={0} addonBefore={<UserOutlined />} className='w-full' />
      </div>
      
      <Statistic valueStyle={{ color: colors.primary }} className='w-full' title="Доступно аккаунтов" value={134} prefix={<UserSwitchOutlined />} />
    </div>

  )
}

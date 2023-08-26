import React from 'react'
import { Button, Card, Descriptions } from 'antd'
import { CheckCircleFilled, EditOutlined, ExclamationCircleFilled, MessageFilled, WarningFilled } from '@ant-design/icons'
import { colors } from '../../global-style/style-colors.module'

const { Item } = Descriptions

interface IProps {
  className?: string,
  title: string,
  dopTitle?: string,
  type: 'success' | 'warning' | 'error' | 'service',
  date?: string,
}

export const StaticMessage = ({ className, title, dopTitle, type, date }: IProps) => {
  return (
    <Card style={{ margin: '1px 1px' }} className={`${className} w-full`}>
      <div className="flex gap-4">
        <div className=" gap-3 items-start mt-[2px]">
          {type === 'success' && <CheckCircleFilled style={{ fontSize: '23px', color: colors.success }} />}
          {type === 'warning' && <WarningFilled  style={{ fontSize: '23px', color: colors.warning }} />}
          {type === 'error' && <ExclamationCircleFilled   style={{ fontSize: '23px', color: colors.danger }} />}
          {type === 'service' && <MessageFilled   style={{ fontSize: '23px', color: colors.accent }} />}
        </div>
        <div 
          style={{ 
            display: type === 'service' ? 'flex' : 'block',
            justifyContent: type === 'service' ? 'space-between' : 'null'
          }} 
          className='w-full'
        >
          <p style={{ margin: '0 0', fontWeight: '600', marginBottom: dopTitle ? '10px' : '0' }} className='text-[18px]'>{title}</p>
          <p style={{ margin: '0 0' }}>{dopTitle}</p>

          {type === 'service' && <Button type='link' icon={<EditOutlined />}>edit</Button>}
          {date && <Descriptions>
            <Descriptions.Item label='Дата' style={{ padding: '0 0' }}>
              {date}
            </Descriptions.Item>
          </Descriptions>}
        </div>
      </div>
    </Card>
  )
}

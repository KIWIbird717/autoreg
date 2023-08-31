import React, { useState } from 'react'
import { Button, Input, Popover, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Title } = Typography

export const SendPreview = ({ className }: { className?: string }) => {
  const [recieverLink, setRecieverLink] = useState<string | null>(null);

  return (
    <div className={`${className} flex flex-col justify-between`}>
      <div className='flex flex-col gap-3'>
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: "0 0" }}>
              Ссылка на акаунт
            </Title>
            <Popover
              className="cursor-pointer"
              title="Ссылка на телеграм акаунт"
              content='Вставте ссылку на ваш телеграм акаунт, чтобы сделать предпросмотр сообщения'
            >
              <InfoCircleOutlined />
            </Popover>
          </div>
          <Input
            size="large"
            placeholder="Ссылка на телеграм акаунт"
            value={recieverLink || ''}
            onChange={(e) => setRecieverLink(e.target.value)}
          />
        </div>
        <Button 
          className='w-full'
        >
          Предпросмотр
        </Button>
      </div>
      <Button 
        className='w-full'
        type='primary'
        size='large'
      >
        Добавить сообщение
      </Button>
    </div>
  )
}

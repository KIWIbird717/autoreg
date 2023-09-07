import React, { useEffect, useState } from 'react'
import { Button, Input, Popover, Typography } from 'antd';
import { FileTextTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { StoreState } from '../../../../store/store';

const { Title } = Typography

export const SendPreview = ({ className, saveDistrImages }: { className?: string, saveDistrImages: () => void}) => {
  const [recieverLink, setRecieverLink] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState<React.Key | null>(null)

  const messages = useSelector((state: StoreState) => state.app.newDistributionMessages.messages)
  const openMessage = useSelector((state: StoreState) => state.app.newDistributionMessages.open)

  useEffect(() => {
    setEditedMessage(openMessage)
  }, [openMessage])

  return (
    <div className={`${className} flex flex-col justify-between`}>
      <div className='flex flex-col gap-3'>
        <div className="w-full flex flex-col gap-1">
          {editedMessage != null && editedMessage != undefined && 
            <div className='flex gap-1 mb-3 mt-2'>
              <FileTextTwoTone />
              <Title level={5} style={{ margin: '0 0' }}>{messages.filter((message) => message.id === editedMessage)[0]?.title || ''}</Title>
            </div>
          }
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
        size='large'
        onClick={saveDistrImages}
      >
        Сохранить
      </Button>
    </div>
  )
}

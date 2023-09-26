import React, { useEffect, useState } from 'react'
import { Button, Input, Popover, Typography, type UploadFile } from 'antd';
import { FileTextTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { StoreState } from '../../../../store/store';

const { Title } = Typography

export const SendPreview = ({ className, saveDistrImages, fileList }: { className?: string, saveDistrImages: () => void, fileList: UploadFile<any>[]}) => {
  const [recieverLink, setRecieverLink] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState<React.Key | null>(null)
  const [needSave, setNeedSave] = useState(false)

  const messages = useSelector((state: StoreState) => state.app.newDistributionMessages.messages)
  const openMessage = useSelector((state: StoreState) => state.app.newDistributionMessages.open)
  const editedMsg = useSelector((state: StoreState) => state.app.newDistributionMessages.messages)

  useEffect(() => {
    if (openMessage == null) return
    // console.log({ fileList: fileList.length, editingMsg: editedMsg[openMessage].media?.length ?? 0, if: fileList.length !== Number(editedMsg[openMessage].media?.length || 0) })
    if (fileList.length !== Number(editedMsg[openMessage].media?.length ?? 0)) {
      setNeedSave(true)
    }
  }, [fileList.length])

  useEffect(() => {
    setEditedMessage(openMessage)
  }, [openMessage])

  const fileSaveHandler = () => {
    saveDistrImages()
    setNeedSave(false)
    // console.log({ current: fileList.length, prev: prevFilesAmount, msg: openMessage, msgPrev: prevFileEdit })
  }

  return (
    <div className={`${className} flex flex-col justify-between`}>
      {editedMessage != null && editedMessage != undefined && 
        <div className='flex gap-1 mb-3 mt-2'>
          <FileTextTwoTone />
          <Title level={5} style={{ margin: '0 0' }}>{messages.filter((message) => message.id === editedMessage)[0]?.title || ''}</Title>
        </div>
      }
      <div className='relative flex flex-col gap-3'>
        <div 
          style={{ backdropFilter: 'blur(3px)' }}
          className='absolute top-[-5px] left-[-5px] w-full h-full bg-white z-10 bg-opacity-5 p-[5px] box-content flex items-center justify-center'
        >
          Временно не доступно
        </div>
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
        size='large'
        onClick={fileSaveHandler}
        type={needSave ? 'primary' : undefined}
      >
        Сохранить
      </Button>
    </div>
  )
}

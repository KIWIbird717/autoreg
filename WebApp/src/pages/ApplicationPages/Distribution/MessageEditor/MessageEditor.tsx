import { useEffect, useState } from 'react';
import { MCard } from '../../../../components/Card/MCard'
import { Divider } from 'antd';
import { CardTitle } from '../../../../components/CardTitle/CardTitle';
import { Uploader } from './Uploader/Uploader';
import { TextEditor } from './TextEditor';
import { SendPreview } from './SendPreview';
import { useDispatch, useSelector } from 'react-redux';
import { updateDistributionMessageEdit } from '../../../../store/appSlice';
import type { UploadFile } from 'antd';
import type { StoreState } from '../../../../store/store';
import { FileTextOutlined } from '@ant-design/icons';


export const MessageEditor = () => {
  const dispatch = useDispatch()
  const opentMessage: number | null = useSelector((state: StoreState) => state.app.newDistributionMessages.open)
  const editedMessage = useSelector((state: StoreState) => state.app.newDistributionMessages.messages)
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSave = () => {
    dispatch(updateDistributionMessageEdit({
      id: opentMessage,
      media: fileList
    }))
  }

  useEffect(() => {
    // console.log(opentMessage)
    if (opentMessage == null) return
    // console.log(editedMessage[opentMessage].media)
    if (!editedMessage[opentMessage]?.media) {
      setFileList([])
      return
    }
    //@ts-ignore check the line above
    setFileList(editedMessage[opentMessage].media)
  }, [opentMessage])

  return (
    <MCard className='relative overflow-hidden'>
      <div 
        style={{ backdropFilter: 'blur(3px)', display: opentMessage == null ? '' : 'none' }}
        className='absolute top-0 left-0 w-full h-full bg-white bg-opacity-5 z-[11] flex items-center justify-center flex-col'
      >
        <FileTextOutlined style={{ fontSize: 54 }} />
        {editedMessage.length > 0 ? (
          <h3 className='px-[50px] text-center max-w-[400px]'>Для редактирования откройте сообщение</h3>
        ) : (
          <h3 className='px-[50px] text-center max-w-[400px]'>Для редактирования создайте сообщение</h3>
        )}
      </div>
      <section className='flex flex-col gap-3'>
        <CardTitle title="Редактор сообщений" />
        <Uploader fileList={fileList} setFileList={setFileList} />
        <Divider style={{ margin: 0 }} />
        <div className='flex gap-3'>
          <TextEditor className='w-[70%]' />
          <SendPreview saveDistrImages={handleSave} fileList={fileList} className='w-[30%]' />
        </div>
      </section>
    </MCard>
  )
}

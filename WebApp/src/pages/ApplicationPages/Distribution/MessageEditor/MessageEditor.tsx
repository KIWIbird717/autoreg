import { useState } from 'react';
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


export const MessageEditor = () => {
  const dispatch = useDispatch()
  const opentMessage = useSelector((state: StoreState) => state.app.newDistributionMessages.open)
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSave = () => {
    dispatch(updateDistributionMessageEdit({
      id: opentMessage,
      media: fileList
    }))
  }


  return (
    <MCard>
      <section className='flex flex-col gap-3'>
        <CardTitle title="Редактор сообщений" />
        <Uploader fileList={fileList} setFileList={setFileList} />
        <Divider style={{ margin: 0 }} />
        <div className='flex gap-3'>
          <TextEditor className='w-[70%]' />
          <SendPreview saveDistrImages={handleSave} className='w-[30%]' />
        </div>
      </section>
    </MCard>
  )
}

import { MCard } from '../../../../components/Card/MCard'
import { Divider } from 'antd';
import { CardTitle } from '../../../../components/CardTitle/CardTitle';
import { Uploader } from './Uploader';
import { TextEditor } from './TextEditor';
import { SendPreview } from './SendPreview';


export const MessageEditor = () => {
  return (
    <MCard>
      <section className='flex flex-col gap-3'>
        <CardTitle title="Редактор сообщений" />
        <Uploader />
        <Divider style={{ margin: 0 }} />
        <div className='flex gap-3'>
          <TextEditor className='w-[70%]' />
          <SendPreview className='w-[30%]' />
        </div>
      </section>
    </MCard>
  )
}

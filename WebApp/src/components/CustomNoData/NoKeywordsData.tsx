import { SmileOutlined } from '@ant-design/icons'

export const NoKeywordsData = () => {

  return (
    <div className='flex flex-col gap-2 items-center justify-center h-[150px]'>
      <div style={{ textAlign: 'center' }}>
        <SmileOutlined style={{ fontSize: 20 }} />
        <p>Вы не добавили слов для парсинга</p>
      </div>
    </div>
  )
}

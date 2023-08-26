import { PlusOutlined, SmileOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useDispatch } from 'react-redux'
import { setAppPage } from '../../store/appSlice'

export const NoAccounts = () => {
  const dispatch = useDispatch()

  return (
    <div className='flex flex-col gap-2 items-center justify-center h-[300px]'>
      <div style={{ textAlign: 'center' }}>
        <SmileOutlined style={{ fontSize: 20 }} />
        <p>Тут пока нет зарегестрированных аккаунтов</p>
      </div>
      <div className="div">
        <Button 
          type='link' 
          icon={<PlusOutlined />}
          onClick={() => dispatch(setAppPage("1"))}
        >Добавить</Button>
      </div>
    </div>
  )
}

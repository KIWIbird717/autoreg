import { BuildOutlined, ReconciliationTwoTone } from '@ant-design/icons'
import { MCard } from '../../../components/Card/MCard'
import { CardTitle } from '../../../components/CardTitle/CardTitle'
import { Button } from 'antd'
import { IAppState } from '../../../store/types'
import { useDispatch } from 'react-redux'
import { setAppPage } from '../../../store/appSlice'
import { resetPageData } from '../../../utils/resetPageData'


export const NoAccountdAD = () => {
  const dispatch = useDispatch();

  const setItem = (page: IAppState["appPage"]): void => {
    dispatch(setAppPage(page))
    resetPageData(dispatch)
  }
  
  return (
    <MCard className='w-full p-2'>
      <div className="flex justify-between items-center">
        <div className='flex items-center justify-center gap-6'>
          <ReconciliationTwoTone style={{ fontSize: 60 }}/>
          <CardTitle 
            title="Нет акаунтов для инвайта?"
            dopTitle='Спарсите участников для приглашения их в группы на вкладке Парсинг'
          />
        </div>
        <Button 
          icon={<BuildOutlined />} 
          type='primary'
          onClick={() => setItem('6')}
        >Парсить акаунты</Button>
      </div>
    </MCard>
  )
}

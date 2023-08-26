import { MCard } from '../../../components/Card/MCard'
import { AutoregHeader } from './AutoregHeader'
import styles from "../../../global-style/scroll-bar-style.module.css"
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'
import { smsServiciesDataType } from '../../../store/types'
import { Spin, Typography } from 'antd'
import { colors } from '../../../global-style/style-colors.module'
import { CheckOutlined, WarningOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import Skeleton from '@mui/material/Skeleton'
import { Typography as MuiTypography }  from '@mui/material'

const { Title } = Typography

interface IProps {
  height: number
}

export const SmsServicies = ({height}: IProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true)
  const smsServicesList = useSelector((state: StoreState) => state.app.smsServiciesData)

  useEffect(() => {
    if (smsServicesList) {
      setLoading(false)
    }
  }, [smsServicesList])
  
  return (
    <MCard className='px-2 py-2 w-full'>
      <div>
        <AutoregHeader 
          title='Список СМС сервисов' 
          dopTitle='Добавленные СМС сервисы' 
        />
      </div>
      <div
        style={{ height: height }}
        className={`flex flex-col gap-3 overflow-y-scroll overflow-x-hidden pr-[5px] ${styles.scroll_bar_style}`}
      >
      {loading ? (
        <div className="flex w-full h-full items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        smsServicesList?.map((service: smsServiciesDataType) => (
          <div key={service.title} className='flex justify-between p-4 border-[1px] border-solid border-[#d9d9d9] rounded-[15px]'>
            {service.balance ? (
              (service.balance === 'loading' ? (
                <div className="flex flex-col justify-between gap-2">
                  <Title className='m-0' level={5}>{service.title}</Title>
                  <div>
                    <p style={{ margin: 0, color: colors.dopFont }}>баланс</p>
                    <MuiTypography variant="h3" style={{ minWidth: 110, margin: 0 }}>
                      <Skeleton animation="wave" style={{ margin: 0 }}/>
                    </MuiTypography>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between gap-2">
                  <Title className='m-0' level={5}>{service.title}</Title>
                  <div>
                    <p style={{ margin: 0, color: colors.dopFont }}>баланс</p>
                    <Title style={{ color: colors.font, margin: 0 }} level={2}>{service.balance}₽</Title>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-between gap-2">
                <Title className='m-0' level={5}>{service.title}</Title>
              </div>
            )}
            <div className="flex flex-col justify-between items-end">
              {service.balance ? (
                (service.balance === 'loading' ? (
                  <div className='min-w-[120px] flex flex-col h-full justify-between'>
                    <Skeleton animation="wave" style={{ height: 60, width: '100%', lineHeight: 0, padding: 0, margin: 0 }} />
                    <Skeleton animation="wave" style={{ width: '100%', lineHeight: 0, padding: 0, margin: 0 }}/>
                  </div>
                ) : (
                  <>
                    <div style={{ backgroundColor: 'rgba(137, 217, 127, 0.4)' }} className='flex items-center rounded-full '>
                      <div style={{ backgroundColor: colors.success }} className='flex items-center justify-center rounded-full w-[35px] h-[35px]'>
                        <CheckOutlined style={{ color: colors.white, fontSize: 18 }}/>
                      </div>
                      <p style={{ margin: 0, color: '#4CA947', fontSize: 15 }} className='pl-3 pr-4'>активен</p>
                    </div>
                    <div style={{ color: colors.dopFont }}><span style={{ fontWeight: 600, color: colors.font }}>{service.cost + '₽'}</span>/аккаунт</div>
                  </>
                ))
              ) : (
                <>
                  <div style={{ backgroundColor: 'rgb(231, 218, 103, 0.4)' }} className='flex items-center rounded-full '>
                    <div style={{ backgroundColor: colors.warning }} className='flex items-center justify-center rounded-full w-[35px] h-[35px]'>
                      <WarningOutlined style={{ color: colors.white, fontSize: 18, marginBottom: 3 }}/>
                    </div>
                    <p style={{ margin: 0, color: '#BABA23', fontSize: 15 }} className='pl-1 pr-2'>нет доступа</p>
                  </div>
                </>
              )}
            </div>
          </div>
        ))
      )}
      </div>
    </MCard>
  )
}

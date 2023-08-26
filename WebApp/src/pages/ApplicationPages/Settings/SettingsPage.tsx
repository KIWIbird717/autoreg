import { useState, useEffect, useRef } from 'react'
import { Typography, Layout, Avatar, Button, Statistic, Input, Card, notification } from 'antd'
import { contentStyle } from '../../../global-style/layoutStyle'
import { HeaderComponent } from '../../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../../components/Card/MCard'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'
import { BookOutlined, BorderlessTableOutlined, CheckOutlined, KeyOutlined, LinkOutlined, PlusOutlined, TagOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'
import { ProxySettingsInput } from './ProxySettingsInput'
import { Progress } from 'antd'
import { colors } from '../../../global-style/style-colors.module'
import { AvatarUploadComponent } from './AvatarUploadComponent'
import { AutoregHeader } from '../Autoreg/AutoregHeader'
import { StaticMessage } from '../../../components/StaticMessage/StaticMessage'
import styles from '../../../global-style/scroll-bar-style.module.css'
import { useContainerDimensions } from '../../../hooks/useContainerDimention'
import { values } from 'lodash'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setUserDefaulAppHash, setUserDefaulAppId } from '../../../store/userSlice'
import { ILocalStorageParced } from '../../../App'


const { Title } = Typography
const { Content } = Layout

type errType = "" | "error" | "warning" | undefined

export const SettingsPage = ({ style }: { style?: React.CSSProperties }) => {
  const dispatch = useDispatch()

  const userName = useSelector((state: StoreState) => state.user.nick)
  const userAvatar = useSelector((state: StoreState) => state.app.userAvatar)
  const userMail = useSelector((state: StoreState) => state.user.mail)

  const defaultAppHashRaw = useSelector((state: StoreState) => state.user.defaultAppHash)
  const defaultAppIdRaw = useSelector((state: StoreState) => state.user.defaultAppId)
  const [defaultAppHash, setDefaultAppHash] = useState<string | null>(defaultAppHashRaw)
  const [defaultAppId, setDefaultAppId] = useState<number | null>(defaultAppIdRaw)

  const [accountsUsage, setAccountsUsage] = useState<number>(0)

  // App hash & App Id
  const [tgAppButton, setTgAppButton] = useState<boolean>(false)

  const [appHash, setappHash] = useState<string>(defaultAppHash || "Не указан")
  const [appId, setAppId] = useState<string>(defaultAppId?.toString() || "0")
  const [hashStatus, setHashStatus] = useState<errType>("")
  const [idStatus, setIdStatus] = useState<errType>("")

  const container = useRef<HTMLInputElement>(null)
  const { height } = useContainerDimensions(container)

  useEffect(() => {
    console.log(defaultAppHashRaw, defaultAppIdRaw)
    setDefaultAppHash(defaultAppHashRaw)
    setDefaultAppId(defaultAppIdRaw)
  }, [defaultAppHash])
  
  const handleAppId = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    if (!isNaN(value)) {
      setAppId(value.toString())
    }
  };

  const setTgApp = async () => {
    setTgAppButton(true)
    if (appHash === 'Не указан') {
      setHashStatus("error")
      setTgAppButton(false)
      return
    }
    if (!appHash) {
      setHashStatus("error")
      setTgAppButton(false)
      return
    }
    if (appHash === defaultAppHash) {
      setHashStatus("error")
      setTgAppButton(false)
      return
    }
    if (appId === "0") {
      setIdStatus("error")
      setTgAppButton(false)
      return
    }
    if (!Number(appId)) {
      setIdStatus("error")
      setTgAppButton(false)
      return
    }
    if (Number(appId) === defaultAppId) {
      setIdStatus("error")
      setTgAppButton(false)
      return
    }
    
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_END_POINT}/updateUserData/update-apphash-appid`, { userMail, appHash, appId })
      if (res.status === 200) {
        notification['success']({
          message: 'Данные успешно обновлены.',
          description: 'App Hash и App Id были успешно обновлены',
          placement: 'bottomRight'
        })
        setTgAppButton(false)
        if (appHash && appId) {
          dispatch(setUserDefaulAppHash(appHash))
          dispatch(setUserDefaulAppId(Number(appId)))
          setappHash(appHash)
          setAppId(appId)
          // set apphash / appid to localstorage
          const token = localStorage.getItem('sessionToken')
          if (token) {
            const tokenData: ILocalStorageParced = JSON.parse(token)
            localStorage.setItem('sessionToken', JSON.stringify({...tokenData, defaultAppHash: appHash, defaultAppId: appId}))
          }
        }
      }
    } catch (err) {
      setTgAppButton(false)
      notification['error']({
        message: 'Ошибка.',
        description: 'Не получилось обновить данные по App Hash и App Id. Попробуйте позже',
        placement: 'bottomRight'
      })
    }

  }

  useEffect(() => {
    setAccountsUsage(9.3)
  })

  return (
    <>
      <Layout style={{ ...contentStyle, ...style }}>
        <HeaderComponent title='Настройки'/>

        <Content className='flex gap-8'>
          <div ref={container} className='flex flex-col w-[60%] max-w-[1100px] gap-8'>
            <MCard title='Настройка профиля' className='w-full' extra={<Button type='link' icon={<CheckOutlined />}>Применить</Button>}>
              <div className="flex items-start gap-8 justify-between">
                <div className="flex items-start gap-8">
                  <Avatar size={110} icon={userAvatar ? userAvatar : <UserOutlined />} />
                  <div className="flex flex-col items-start justify-start gap-3">
                    <p style={{ margin: '0 0' }}>Имя</p>
                    <Title editable style={{ margin: '0 0' }} level={2}>{userName}</Title>
                    <AvatarUploadComponent />
                  </div>
                </div>

                <div className="min-w-[300px] f-full">
                  <Statistic title="Использовано аккаунтов" value={93} suffix="/ 1000" />
                  <Progress percent={accountsUsage} strokeColor={colors.primary}/>
                </div>
              </div>
            </MCard>

            <MCard title='Настройка proxy Telegram' extra={<Button loading={tgAppButton} onClick={() => setTgApp()} type='link' icon={<PlusOutlined />}>Добавить</Button>}>
              <div className="flex gap-8 justify-between items-center">
                <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-col gap-2">
                    <p style={{ margin: '0 0' }}>App Hash</p>
                    <Input 
                      prefix={<BorderlessTableOutlined />} 
                      size='large' 
                      placeholder='App Hash' 
                      value={appHash}
                      onChange={(e) => {setappHash(e.target.value); setHashStatus("")}}
                      status={hashStatus}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p style={{ margin: '0 0' }}>App id</p>
                    <Input 
                      prefix={<TagOutlined />} 
                      size='large' 
                      placeholder='App Id' 
                      value={appId}
                      onChange={(e) => {handleAppId(e); setIdStatus("")}}
                      status={idStatus}
                    />
                  </div>
                </div>

                <div className="max-w-[270px] h-full flex flex-col gap-3">
                  <p style={{ margin: '0 0' }}>Данный API Hash и API ID необходимо взять на официальном сайте Telegram</p>
                  <div className="flex items-center gap-3">
                    <Button icon={<BookOutlined />}>Инструкция</Button>
                    <Button type='link' icon={<LinkOutlined />}>Ссылка</Button>
                  </div>
                </div>
              </div>
            </MCard>

            {/* <MCard title='Добавить API ключ для СМС сервиса' extra={<Button disabled type='link' icon={<PlusOutlined />}>Добавить</Button>}>
              <div className="flex gap-8 justify-between items-center">
                <div className="flex flex-col gap-3 w-full">
                  <ProxySettingsInput title='API link'/>
                  <div className="flex flex-col gap-2">
                    <p style={{ margin: '0 0' }}>Secret key</p>
                    <Input prefix={<KeyOutlined />} size='large' placeholder='Secret key' />
                  </div>
                </div>

                <div className="max-w-[270px] h-full flex flex-col gap-3">
                  <p style={{ margin: '0 0' }}>Вы можете добавить свой СМС сервис, вствив API ссылку и Secret key</p>
                  <div className="flex items-center gap-3">
                    <Button icon={<BookOutlined />}>Инструкция</Button>
                  </div>
                </div>
              </div>
            </MCard> */}
          </div>

          <div className="max-w-[700px] w-[40%]">
            <MCard className='px-2 py-2 w-full'>
              <AutoregHeader 
                title='Недавние действия' 
                dopTitle='Последняя информация об аккаунтах' 
              />
              <div style={{ height: height }} className={`flex flex-col gap-3 overflow-y-scroll overflow-x-hidden pr-[5px] ${styles.scroll_bar_style}`}>
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='success'
                  date='12 апреля, 2023'
                />
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='success'
                  date='12 апреля, 2023'
                />
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='warning'
                  date='12 апреля, 2023'
                />
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='error'
                  date='12 апреля, 2023'
                />
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='error'
                  date='12 апреля, 2023'
                />
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='error'
                  date='12 апреля, 2023'
                />
              </div>
            </MCard>
          </div>
        </Content>
      </Layout>
    </>
  )
}

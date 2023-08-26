import React, { useEffect, useMemo, useRef } from 'react'
import { ConfigProvider, Layout, Space, notification } from 'antd'
import { SiderComponent } from '../components/SiderComponent/SiderComponent'
import { siderStyle } from '../global-style/layoutStyle'
import { motion } from "framer-motion"
import { IRootStoreState } from '../store/types';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'

import { RouterPages } from './ApplicationPages/RouterPages'
import { StoreState } from '../store/store'
import { useDispatch } from 'react-redux'
import { setLogs } from '../store/appSlice'
import { NoDataDefault } from '../components/CustomNoData/NoDataDefault'

const { Sider } = Layout
const Context = React.createContext({ name: 'Default' })
const socketUrl = process.env.REACT_APP_WEBSOCKET_END_POINT // WebSocket endpoint url

export const Application = (): JSX.Element => {
  const dispatch = useDispatch()

  const siderWidth: number = 250
  const isUserLogined = useSelector((state: IRootStoreState) => state.user.isUserLogined)
  const userToken = useSelector((state: StoreState) => state.user.token)
  const tokenRef = useRef<string>()
  const [api, contextHolder] = notification.useNotification();

  const navigate = useNavigate()

  // Create notification message
  const openNotification = () => {
    api.warning({
      message: `Ошибка обновления данных`,
      description: <Context.Consumer>{() => 'Вы были отключены от потока обновления данных, приложение может работать не стабильно. Попробуйте обновить страницу или зайти на сайт позже, возможно проблемы с сервером'}</Context.Consumer>,
      placement: 'bottomRight',
    });
  };

  useEffect(() => {
    if (userToken) {
      tokenRef.current = userToken
    }
  }, [userToken])

  // Check if user not signed in
  useEffect(() => {
    if (!isUserLogined) navigate('/')
  }, [isUserLogined])

  /**
   * WebSocket connection
   * Once user is registered.
   * 
   * Subscribe to MongoDB change updates
   * Need to update data in logs and all statement in the react application
   */
  const logsRef = useRef<string>()

  const { sendJsonMessage } = useWebSocket(socketUrl as string, {
    queryParams: {
      token: userToken as string,
    },
    protocols: userToken as string,
    onMessage: (event) => {
      const res = JSON.parse(event.data)
      console.log(new Blob([JSON.stringify(event.data)]).size / 1_000_000, 'mb')  // get size of data in mb
      if (res.status == 200) {
        // Chek if response not the same as prev
        if (logsRef.current !== JSON.stringify(res.data)) {
          // set new logs to storage
          dispatch(setLogs(res.data))
          console.log(res.data)
          logsRef.current = JSON.stringify(res.data)
        }
      } else if (res.status == 404) {
        // Here will be something...
      } 
      else {
        console.error(res)
        // openNotification()
      }
    },
    onClose: () => {
      openNotification()
    },
    reconnectAttempts: 5,
  })

  useEffect(() => {
    if (!tokenRef) return
    sendJsonMessage({ token: tokenRef.current })
    setInterval(() => {
      if (!tokenRef) return
      sendJsonMessage({ token: tokenRef.current })
    }, 5_000)
  }, [])
  
  const contextValue = useMemo(() => ({ name: 'Ant Design' }), [])  // for message component

  return (
    <Context.Provider value={contextValue}>
      <ConfigProvider renderEmpty={NoDataDefault}>
        {contextHolder}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
            <Layout>
              <Sider style={siderStyle} width={siderWidth} collapsible={false}>
                <SiderComponent />
              </Sider>
              
              <RouterPages />
            </Layout>
          </Space>
        </motion.div>
      </ConfigProvider>
    </Context.Provider>
  )
}

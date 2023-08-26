import { Header } from 'antd/es/layout/layout'
import { Typography, Button, Badge } from 'antd'
import { colors } from '../../global-style/style-colors.module'
import { BellOutlined, UserOutlined } from '@ant-design/icons'
import { headerStyle } from '../../global-style/layoutStyle'
import { useSelector } from 'react-redux'
import { StoreState } from '../../store/store'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { setAppPage } from '../../store/appSlice'

type propsType = {
  title: string
}

/**
 *  Header component for application
 * @prop title
 */
export const HeaderComponent = ({title}: propsType) => {
  const { Title } = Typography
  const userNickName = useSelector((state: StoreState) => state.user.nick)
  const dispatch = useDispatch()

  const handleNotificationButton = () => {
    dispatch(setAppPage('5'))
  }

  return (
    <Header style={ headerStyle }>
      <div className='w-full h-full flex items-center'>
        <div className="w-full flex justify-between items-start">
          <div className='flex flex-col items-start gap-1'>
            <Title style={{ margin: '0px 0px' }} level={5}>Здравствуйте, {userNickName}</Title>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Title style={{ margin: '0px 0px', fontWeight: 'bold' }} level={1}>{title}</Title>
            </motion.div>
          </div>
          <div className='flex items-start gap-4'>
            <Badge count={5}>
              <Button onClick={handleNotificationButton} style={{ backgroundColor: colors.white }} icon={<BellOutlined />} size='large' />
            </Badge>
            <Button style={{ backgroundColor: colors.white }} icon={<UserOutlined />} size='large' />
            {/* <p className=''>Услуга оплачена</p> */}
          </div>
        </div>
      </div>
    </Header>
  )
}

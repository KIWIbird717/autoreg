import React, { useState } from 'react'
import { Button, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { colors } from '../global-style/style-colors.module';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import { useDispatch } from 'react-redux';
import { setUserDefaulAppHash, setUserDefaulAppId, setUserId, setUserToken, setUserIsLogined, setUserMail, setUserNick } from '../store/userSlice';
import { isValidEmail } from '../utils/isValidEmail';
import { isValidNick } from '../utils/isValidNick';
import Logo from "../images/fullLogo.svg"


const { Title } = Typography

interface IOnFinish {
  nick: string,
  mail: string,
  password: string,
}

interface IFormError {
  validate: "" | "success" | "warning" | "error" | "validating" | undefined,
  msg: string
}

const regFieldStyle: React.CSSProperties = {
  width: '100%',
  marginBottom: '10px'
}

export const Registration = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<IFormError>({validate: "", msg: ""})
  const [nickErr, setNickErr] = useState<IFormError>({validate: "", msg: ""})
  
  const dispatch = useDispatch()

  const notificationHandler = () => {
    notification['error']({
      message: 'Что-то пошло не так',
      description: 'Попробуйте зарегестрироваться позже. Возможно ошибка сервера',
      placement: 'bottomRight'
    })
  }

  const onFinish = async ({nick, mail, password}: IOnFinish): Promise<void> => {
    try {
      if (!nick) {
        setNickErr({validate: "error", msg: 'Пожалуйста, введите Никнейм!' })
        return
      }
      if (!isValidNick(nick)) {
        setNickErr({validate: "error", msg: 'Никнейм должен содержать только буквы' })
        return
      }
      if (!mail) {
        setFormError({validate: "error", msg: 'Пожалуйста, введите Почту!' })
        return
      }
      if (!isValidEmail(mail)) {
        setFormError({validate: "error", msg: 'Введите правильный адрес почты' })
        return
      }
      setLoading(true)
      const url: string = `${process.env.REACT_APP_SERVER_END_POINT as string}/newUser/registration`
  
      await axios.post(url, { nick, mail, password, defaultAppHash: "Не указано" , defaultAppId: 0 })
        .then((res: any) => {
          if (res.status === 201) {
            console.log(res)
            dispatch(setUserMail(mail))
            dispatch(setUserNick(res.data.nick))
            dispatch(setUserId(res.data.id))
            dispatch(setUserToken(res.data.token))
            dispatch(setUserMail(mail))
            dispatch(setUserDefaulAppHash(res.data.defaultAppHash))
            dispatch(setUserDefaulAppId(res.data.defaultAppId))
            const localStorageData = {
              mail: mail,
              nick: res.data.data.nick,
              id: res.data.data.id,
              token: res.data.token,
              defaultAppHash: res.data.data.defaultAppHash,
              defaultAppId: res.data.data.defaultAppId,
              latestUpdate: Number(new Date()),
            }
            localStorage.setItem('sessionToken', JSON.stringify(localStorageData))  // should contain only user email
            // Should be in the end
            dispatch(setUserIsLogined(true))
          }
          setLoading(false)
        })

    } catch (err: any) {
      setLoading(false)

      if (err.response?.data.message === "User with this email already exists") {
        setFormError({validate: "error", msg: 'Такой пользователь уже существует'})
      } else {
        notificationHandler()
      }
    }
  }


  return (
    <div className='w-ful h-[100vh] flex items-center justify-center'>
      <div className='w-[300px]'>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Form.Item>
            <div className="w-[270px] h-full object-contain">
              <img src={Logo} alt="logo"/>
            </div>
          </Form.Item>
          <Form.Item>
            <Title level={5}>Создайте свой аккаунт в TeleSpace</Title>
          </Form.Item>
          
          <Form.Item
            name="nick"
            style={regFieldStyle}
            validateStatus={nickErr.validate}
            help={nickErr.msg}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Никнейм" onChange={() => setNickErr({validate: "", msg: ""})}/>
          </Form.Item>
          <Form.Item
            name="mail"
            style={regFieldStyle}
            validateStatus={formError.validate}
            help={formError.msg}
          >
            <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Почта" onChange={() => setFormError({validate: "", msg: ""})}/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
            style={regFieldStyle}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>

          <Form.Item style={{ width: '100%' }}>
            <Button 
              loading={loading} 
              size='large' 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%', background: colors.primary }}
            >
              Зарегестрироваться
            </Button>
          </Form.Item>

          <Form.Item style={{ width: '100%' }}>
            <div className='w-full flex gap-[10px]'>
              Уже есть аккаунт?
              <Link to="/">Войдите</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

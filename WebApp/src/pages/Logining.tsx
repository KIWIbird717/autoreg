import React, { useState } from 'react'
import { Button, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { notification } from 'antd';
import { useDispatch } from 'react-redux';
import { setUserIsLogined, setUserMail, setUserNick, setUserId, setUserToken, setUserDefaulAppHash, setUserDefaulAppId } from '../store/userSlice';
import { isValidEmail } from '../utils/isValidEmail';
import { Link } from 'react-router-dom';
import Logo from "../images/fullLogo.svg"

const { Title } = Typography

interface IOnFinish {
  mail: string,
  password: 'string',
  remember: boolean
}

interface IFormError {
  validate: "" | "success" | "warning" | "error" | "validating" | undefined,
  msg: string
}

const regFieldStyle: React.CSSProperties = {
  width: '100%',
  marginBottom: '10px'
}

export const Logining = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<IFormError>({validate: "", msg: ""})
  const [passError, setPassError] = useState<IFormError>({validate: "", msg: ""})

  const dispatch = useDispatch()

  const notificationHandler = () => {
    notification['error']({
      message: 'Что-то пошло не так',
      description: 'Попробуйте зарегестрироваться позже. Возможно ошибка сервера',
      placement: 'bottomRight'
    })
  }

  const onFinish = async ({mail, password}: IOnFinish): Promise<void> => {
    try {
      if (!mail) {
        setFormError({validate: "error", msg: 'Пожалуйста, введите Почту!' })
        return
      }
      if (!isValidEmail(mail)) {
        setFormError({validate: "error", msg: 'Введите правильный адрес почты' })
        return
      }
      setLoading(true)
      const url: string = `${process.env.REACT_APP_SERVER_END_POINT as string}/newUser/login`
  
      await axios.post(url, { mail, password })
        .then((res: any) => {
          if (res.status === 201) {
            dispatch(setUserMail(mail))
            dispatch(setUserNick(res.data.data.nick))
            dispatch(setUserId(res.data.data.id))
            dispatch(setUserToken(res.data.token))
            dispatch(setUserDefaulAppHash(res.data.data.defaultAppHash))
            dispatch(setUserDefaulAppId(res.data.data.defaultAppId))
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
            // should be in the end
            dispatch(setUserIsLogined(true))
          }
          setLoading(false)
        })
    } catch (err: any) {
      setLoading(false)

      switch (err.response?.data.message) {
        case "Uncurrect password":
          setPassError({validate: "error", msg: 'Неверный пароль'})
          break

        case "User not found":
          setFormError({validate: "error", msg: 'Пользователь не существует'})
          break

        default:
          notificationHandler()
          break
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
            <Title level={5}>Войдите в свой аккаунт TeleSpace</Title> 
          </Form.Item>

          <Form.Item
            name="mail"
            style={regFieldStyle}
            validateStatus={formError.validate}
            help={formError.msg}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="Почта" onChange={() => setFormError({validate: "", msg: ""})}/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
            style={regFieldStyle}
            validateStatus={passError.validate}
            help={passError.msg}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
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
              style={{ width: '100%' }}
              // disabled
            >
              Войти
            </Button>
          </Form.Item>

          <Form.Item style={{ width: '100%' }}>
            <div className='w-full flex gap-[10px]'>
              Нет аккаунта?
              <Link to="/registration">Зарегестрируйтесь</Link>
            </div>
          </Form.Item>

        </Form>
      </div>
    </div>
  )
}

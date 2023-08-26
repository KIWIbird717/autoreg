import React from 'react'
import { Cascader, Popover, Typography, TimePicker } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs';

const { Title } = Typography

export const Enterance = () => {
  return (
    <div className="div">
      <div className="w-full flex gap-3 mb-5">
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Отправка сообщений</Title>
            <Popover className='cursor-pointer' title="Отправка сообщений" content='Установка задержки между написанием сообщений'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <TimePicker placeholder='Установить время' size='large' className='w-full' onChange={() => console.log()} defaultValue={dayjs('00:00:00', 'HH:mm:ss')} />
        </div>
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Вступление в чаты</Title>
            <Popover className='cursor-pointer' title="Вступление в чаты" content='Установка задержки на вступление в телграм чаты, каналы и грппый'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <TimePicker placeholder='Установить время' size='large' className='w-full' onChange={() => console.log()} defaultValue={dayjs('00:00:00', 'HH:mm:ss')} />
        </div>
      </div>

      <div className="w-full flex gap-3 mb-5">
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Нахождение в онлайн</Title>
            <Popover className='cursor-pointer' title="Нахождение в онлайн" content='Установка примерного времени нахождения онлайн'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <TimePicker placeholder='Установить время' size='large' className='w-full' onChange={() => console.log()} defaultValue={dayjs('00:00:00', 'HH:mm:ss')} />
        </div>
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Добавление в контакты</Title>
            <Popover className='cursor-pointer' title="Добавление в контакты" content='Установка задержки на заявку в друзья'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <TimePicker placeholder='Установить время' size='large' className='w-full' onChange={() => console.log()} defaultValue={dayjs('00:00:00', 'HH:mm:ss')} />
        </div>
      </div>
    </div>
  )
}

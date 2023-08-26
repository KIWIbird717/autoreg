import { useState, useRef } from 'react'
import { Card, Layout, Popover, Segmented } from 'antd'
import { contentStyle } from '../../../global-style/layoutStyle'
import { HeaderComponent } from '../../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../../components/Card/MCard'
import { AutoregHeader } from './AutoregHeader'
import { NewFolderSettings } from './NewFolderSettings'
import { AnimatePresence, motion } from 'framer-motion'
import { useContainerDimensions } from '../../../hooks/useContainerDimention'
import { SmsServicies } from './SmsServicies'
import { Col, Row } from 'antd';
import { AddToFolderSettings } from './AddToFolderSettings'
import { ManualSettings } from './ManualSettings'
import { colors } from '../../../global-style/style-colors.module'

import CreateNewFolderRoundedIcon from '@mui/icons-material/CreateNewFolderRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import { MehOutlined } from '@ant-design/icons'


const { Content } = Layout

interface ISegment {
  key: React.Key,
  label: React.ReactNode,
  value: number,
}

type segmentValueType = number | string

export const AutoRegPage = ({ style }: { style?: React.CSSProperties }) => {
  const [segmentValue, setSegmentValue] = useState<segmentValueType>(2)

  const Segment = [
    {
      key: '1',
      disabled: true,
      label: (
        <Popover content={<div className='flex flex-col items-center'><p>Времнно не доступно</p><MehOutlined style={{ fontSize: 30 }}/></div>}>
        <div className=' h-[130px] flex flex-col items-center justify-center'>
          <div className="object-conatin w-full h-[60px] mb-3 flex flex-col items-center justify-center">
            {/* <img className='h-full' src={img1} alt='img'/> */}
            <div className="flex items-center justify-center w-[65px] h-[65px] bg-[#d7eafc] rounded-full">
              <CreateNewFolderRoundedIcon style={{ color: colors.primary, fontSize: 40 }}/>
            </div>
          </div>
          <p style={{ margin: '0 0' }} className='w-[90px] leading-[1.1]'>Новая папка</p>
        </div>
        </Popover>
      ),
      value: 0,
    },
    {
      key: '2',
      disabled: true,
      label: (
        <Popover content={<div className='flex flex-col items-center'><p>Времнно не доступно</p><MehOutlined style={{ fontSize: 30 }}/></div>}>
        <div className=' h-[130px] flex flex-col items-center justify-center'>
          <div className="object-conatin w-full h-[60px] mb-3 flex flex-col items-center justify-center">
            {/* <img className='h-full' src={img1} alt='img'/> */}
            <div className="flex items-center justify-center w-[65px] h-[65px] bg-[#ffdcd0] rounded-full">
              <FolderOpenRoundedIcon style={{ color: colors.accent, fontSize: 40 }}/>
            </div>
          </div>
          <p style={{ margin: '0 0' }} className='w-[90px] leading-[1.1]'>Добавить</p>
        </div>
        </Popover>
      ),
      value: 1
    },
    {
      key: '3',
      label: (
        <div className=' h-[130px] flex flex-col items-center justify-center'>
          <div className="object-conatin w-full h-[60px] mb-3 flex flex-col items-center justify-center">
            {/* <img className='h-full' src={img1} alt='img'/> */}
            <div className="flex items-center justify-center w-[65px] h-[65px] bg-[#fff5c7] rounded-full">
              <AssignmentRoundedIcon style={{ color: colors.accent2, fontSize: 40 }}/>
            </div>
          </div>
          <p style={{ margin: '0 0' }} className='w-[90px] leading-[1.1]'>Ручной ввод</p>
        </div>
      ),
      value: 2
    },
  ]

  const container = useRef<HTMLInputElement>(null)
  const mainCard = useRef<HTMLInputElement>(null)

  const { width } = useContainerDimensions(container)
  const { height } = useContainerDimensions(mainCard)

  return (
    <Layout style={{...contentStyle, ...style}}>
      <HeaderComponent title='Авторегистратор'/>

      <Content className='flex flex-col gap-8'>
        <div className="w-full h-[400px]">
          <Card className='w-full h-full bg-[#3d8de9] flex items-center justify-center rounded-[20px]'>
            <h1 className='text-[#75a6df] text-8xl font-black uppercase'>Тут будет банер</h1>
          </Card>
        </div>
        <Row gutter={32}>
          <Col span={15}>
            <MCard className='px-2 py-2 w-full z-10'>
              <AutoregHeader 
                title='Установка параметров регистрации' 
                dopTitle='Создайте новую папку с аккаунтами или обновите существующую' 
              />
              <div ref={mainCard} className="flex flex-col">
                <div className="w-full flex items-start justify-center flex-col mb-8 ">
                  <Segmented style={{ borderRadius: '12px' }} value={segmentValue} onChange={setSegmentValue} block options={Segment} className='w-full'/>
                </div>
                <div ref={container} className="flex overflow-hidden">
                  <AnimatePresence>
                    <motion.div
                      animate={{
                        x: -segmentValue * width,
                        transition: {type: "spring", bounce: 0.1, duration: 0.6}
                      }}
                      className='w-full flex'
                    >
                      <NewFolderSettings key={0} current={0} value={segmentValue} />
                      <AddToFolderSettings key={1} current={1} value={segmentValue} />
                      <ManualSettings key={2} current={2} value={segmentValue} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </MCard>
          </Col>
          <Col span={9}>
            <SmsServicies height={height}/>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

import { Layout, Divider, Button, Typography, Avatar, Card, Switch } from 'antd'
import { contentStyle } from '../../../global-style/layoutStyle'
import { HeaderComponent } from '../../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../../components/Card/MCard'
import { AutoregHeader } from '../Autoreg/AutoregHeader'
import { Groups } from './Groups'
import { Messages } from './Messages'
import { Enterance } from './Enterance'
import { Start } from './Start'
import { ApiTwoTone, BugTwoTone, CommentOutlined, FlagOutlined, MessageTwoTone, TeamOutlined } from '@ant-design/icons'
import { colors } from '../../../global-style/style-colors.module'

const { Content } = Layout
const { Title } = Typography

export const WarmingUpPage = ({ style }: { style?: React.CSSProperties }) => {

  return (
    <>
      <Layout style={{...contentStyle, ...style}}>
        <HeaderComponent title='Прогрев'/>

        <Content className='flex gap-8'>
          <div className="flex flex-col gap-8 w-full max-w-[1400px] z-1-">
            <MCard className='w-full px-2 py2'>
              <div className="flex justify-between">
                <AutoregHeader 
                  title='Параметры входа' 
                  dopTitle='Задайте пареметры для входа в группы, чаты, каналы' 
                />
              </div>
              <Enterance />
            </MCard>

            <MCard className='w-full px-2 py2'>
              <AutoregHeader 
                title='Указание сообщений для переписки' 
                dopTitle='Заготовте примеры сообщений для переписки телеграм аккаунтов' 
              />
              <Messages />
            </MCard>

            <MCard className='w-full px-2 py2'>
              <AutoregHeader 
                title='Объекты входа' 
                dopTitle='Установите колличество аккаунтов для начала прогрева' 
              />
              <Start />

              <div className="w-full flex justify-end">
                <Button size='large' type='primary' >Запустить прогрев</Button>
              </div>
            </MCard>
          </div>

          <MCard className='px-2 py-2 w-full h-fit max-w-[400px]'>
            <AutoregHeader 
              icon={<MessageTwoTone style={{ fontSize: 22 }}/>}
              title='Группы, чаты, каналы' 
              dopTitle='Добавте чаты и группы, для телеграм аккаунтов' 
            />
            <div className="flex w-full gap-4 mb-7">
              <Card style={{ padding: '0px 0px', borderColor: colors.dopFont2, borderRadius: '15px' }} className="shadow-md felx items-center justify-center w-full">
                <div className="flex w-full items-center justify-between">
                  <Avatar icon={<ApiTwoTone twoToneColor={colors.primary}/>} size='large' style={{backgroundColor: colors.dopFont2}} />
                  <Title level={3} style={{ margin: '0 0' }}>{21}</Title>
                </div>
              </Card>
              <Card style={{ padding: '0px 0px', borderColor: colors.dopFont2, borderRadius: '15px' }} className="shadow-md felx items-center justify-center w-full">
                <div className="flex w-full items-center justify-between">
                  <Avatar icon={<BugTwoTone twoToneColor={colors.accent}/>} size='large' style={{backgroundColor: colors.dopFont2}}/>
                  <Title level={3} style={{ margin: '0 0' }}>{76}</Title>
                </div>
              </Card>
            </div>
            <Groups title='Группы' icon={<TeamOutlined />}/>
            <Divider />
            <Groups title='Чаты' icon={<CommentOutlined />}/>
            <Divider />
            <Groups title='Каналы' icon={<FlagOutlined />}/>
          </MCard>
        </Content>
      </Layout>
    </>
  )
}

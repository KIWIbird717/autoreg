import { useMemo, useRef, useState } from 'react'
import { Layout, List, Button, message, Tag, Badge } from 'antd'
import { contentStyle } from '../../../global-style/layoutStyle'
import { HeaderComponent } from '../../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../../components/Card/MCard'
import { SelectOptions } from './SelectOptions'
import { formatDate } from '../../../utils/formatDate'
import styles from '../../../global-style/scroll-bar-style.module.css'
import { DownloadOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'
import type { ILogs } from '../../../store/types'

const { Content } = Layout;

interface IPretyLogData {
  typeLog: string
  message: string
  dateTime: Date | number
  status: 'success' | 'warning' | 'error' | 'info' | string
}

export type IPretyLog = IPretyLogData | { typeLog: string, id: string | undefined, status: string };

export const logsToNormal = (logsRaw: ILogs | null, debug: boolean): IPretyLog[] | any[] => {
  let logsPretty: IPretyLog[] | any[] = []

  // Chek if logs are not seted
  if (!logsRaw) return []

  // Make pretty logs
  logsRaw.list_logs.forEach((log) => {
    const typeLog = log.type_log

    let logItem: IPretyLog[] = []
    log.entity_logs.forEach((entity) => {
      // if debug is unactive option
      if (!debug) {
        if (entity.type_message === 'debug') return;
      }

      const logItemProps: IPretyLog = {
        typeLog: typeLog,
        message: entity.message,
        dateTime: Number(new Date(entity.datetime)) * 1000,
        status: entity.type_message,
      }
      logItem.push(logItemProps)
    })
    logItem.unshift({ typeLog: 'divider', id: log._id, status: log.task_status });
    logsPretty = [...logsPretty, ...(logItem.reverse())]
  })

  // Sort logs by time
  const sortedLogs = logsPretty.sort((a, b) => b.dateTime - a.dateTime)

  return sortedLogs.reverse();
}

export const LogsPage = ({ style }: { style?: React.CSSProperties }) => {
  const headerRef = useRef<HTMLInputElement>(null)
  // const { height } = useContainerDimensions(headerRef) dont foget to fix this issue on frontEnd update
  const globalPadding = Number((contentStyle.padding as string).slice(4,6))

  // Current logs
  const logsRaw = useSelector((state: StoreState) => state.app.logs)
  const [logs, setLogs] = useState<IPretyLog[] | null>(null)

  // Converting logs from backend to pretty format

  // Parse Raw Logs data to sorted
  useMemo(() => {
    setLogs(logsToNormal(logsRaw, false))
  }, [logsRaw])

  const onSearch = (value: string) => {
    console.log(value)
  }

  return (
    <Layout style={{ ...contentStyle, ...style}}>
      <div ref={headerRef}>
        <HeaderComponent title='Логи'/>
      </div>

      <Content>
        <MCard className='px-2 py-2'>
        <div className='flex justify-between'>
          <div className="mb-7 flex gap-3">
            {/* <MSearch
              placeholder="Поиск по логам"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
            /> */}
            <SelectOptions rawLogs={logsRaw} setLogs={setLogs}/>
          </div>
          <Button 
            className='border-[0px] shadow-md' 
            size='large' 
            shape="circle" 
            icon={<DownloadOutlined />} 
            onClick={() => message.success('Логи скачаны в папку Загрузки')} 
          />
        </div>
        <div 
          // style={{ maxHeight: `calc(100vh - ${height + globalPadding + 140}px)` }} // Dont foget to fix
          style={{ maxHeight: `calc(100vh - ${150 + globalPadding + 140}px)` }}
          className={`w-full overflow-y-scroll overflow-x-hidden mr-8 ${styles.scroll_bar_style}`}
        >
          <List
            bordered
            style={{ minHeight: '100vh' }}
            // loading={!logs?.length ? true : false}
            size='small'
            dataSource={logs === null ? [] : logs}
            renderItem={(log) => {
              let log_status: "success" | "warning" | "error" | "default" | "processing" | undefined;

              switch (log.status) {
                case 'info':
                  log_status = 'default';
                  break;
                case 'success':
                  log_status = 'success';
                  break;
                case 'error':
                  log_status = 'error';
                  break;
                case 'pending':
                  log_status = 'processing';
                  break;
                default:
                  log_status = 'default';
                  break;
              }

              return (
                log.typeLog === 'divider' ? (
                  <List.Item>
                    <div className="flex gap-3">
                      <Badge status={log_status}/>
                      <span style={{ fontWeight: 500 }}>id задачи: {(log as any).id}</span>
                    </div>
                  </List.Item>
                ) : (
                  <List.Item>
                    <div className='w-full flex justify-between'>
                      <div className='w-[80%]'>
                        <Tag color={log.typeLog === 'parser' ? 'blue' : 'purple'}>{`[${log.typeLog.toUpperCase()}]`}</Tag> {(log as any).message}
                      </div>
                      <div className="max-w-[20%]">
                        {`${formatDate((log as any).dateTime)}`}
                      </div>
                    </div>
                  </List.Item>
                )
              )
            }}
          />
        </div>
        </MCard>
      </Content>
    </Layout>
  )
}

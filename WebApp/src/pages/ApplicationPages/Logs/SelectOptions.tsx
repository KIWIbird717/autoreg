import { Select } from 'antd';
import styles from './styles.module.scss';
import { logsToNormal, type IPretyLog } from './LogsPage';
import type { ILogs } from '../../../store/types';

interface IProps {
  rawLogs: ILogs | null
  setLogs: (value: React.SetStateAction<IPretyLog[] | null>) => void
}

export const SelectOptions = ({ rawLogs, setLogs }: IProps) => {

  const filterLogs = (value: string | string[]) => {
    const filteredRawLogs = rawLogs?.list_logs.filter((log_entity) => value.includes(log_entity.type_log))
    if (filteredRawLogs === undefined || !rawLogs?.mail) return;
    if (value.includes('debug')) {
      setLogs(logsToNormal({ ...rawLogs, list_logs: filteredRawLogs }, true))
    } else {
      setLogs(logsToNormal({ ...rawLogs, list_logs: filteredRawLogs }, false))
    }
  }

  const options = [
    {
      label: 'Инвайтинг',
      value: 'inviter',
    },
    {
      label: 'Парсинг',
      value: 'parser',
    },
    {
      label: 'Debug',
      value: 'debug',
    }
  ]

  return (
    <Select
      mode="multiple"
      size='large'
      onChange={filterLogs}
      style={{ width: 540 }}
      className={styles.select}
      options={options}
      defaultValue={['inviter', 'parser']}
    />
  )
}

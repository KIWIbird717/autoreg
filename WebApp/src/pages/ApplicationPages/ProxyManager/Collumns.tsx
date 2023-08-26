import type { ColumnsType } from 'antd/es/table';
import proxyFolders from '../../../images/proxyFolder.svg'
import { Typography, Button } from 'antd'
import { useDispatch } from 'react-redux';
import { setProxyManagerFolder } from '../../../store/appSlice';
import { FolderOpenOutlined, SafetyCertificateTwoTone } from '@ant-design/icons';
import { colors } from '../../../global-style/style-colors.module';
import styles from './style.module.css'
import { IProxyData } from './ParseAccountsTable';

export interface IProxyHeaderType {
  key: React.Key,
  folder: string,
  dopTitle: string,
  count: number,
  country: string,
  latestActivity: string,
  proxies: IProxyData[]
}


const { Title } = Typography

export const TableHeaders = () => {
  const dispatch = useDispatch()

  const tableHeaders: ColumnsType<IProxyHeaderType> = [
    {
      title: 'Папка',
      dataIndex: 'folder',
      render: (_, record) => (
        <div className="flex items-center justify-between">
          <div 
            className={`${styles.folder_style} flex items-center gap-5 p-2 rounded-md hover:bg-slate-50`}
            onClick={() => dispatch(setProxyManagerFolder(record.key))}
          >
            <div className='h-[110px] object-contain'>
              <img className='w-full h-full' src={proxyFolders} alt='icon'/>
            </div>
            <div className="flex flex-col gap-1">
              <Title style={{ margin: '0px 0px' }} level={4}>{record.folder}</Title>
              <Title style={{ margin: '0px 0px', fontWeight: '400' }} type='secondary' level={5}>{record.dopTitle}</Title>
            </div>
          </div>
          <Button icon={<FolderOpenOutlined />} onClick={() => dispatch(setProxyManagerFolder(record.key))}>Открыть</Button>
        </div>
      )
    },
    {
      title: 'Кол-во proxy',
      dataIndex: 'count',
      render: (accounts: number) => (
        <div className="flex gap-2">
          <Title style={{ margin: '0px 0px' }} level={5}>{accounts}</Title>
          <SafetyCertificateTwoTone twoToneColor={colors.accent}/>
        </div>
      ),
    },
    {
      title: 'Страна',
      dataIndex: 'country',
    },
    {
      title: 'Последнее изменение',
      dataIndex: 'latestActivity',
    },
  ]

  return tableHeaders
}


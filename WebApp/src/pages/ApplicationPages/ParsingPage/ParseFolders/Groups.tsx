import { MCard } from '../../../../components/Card/MCard'
import { Button, ConfigProvider, Table, Tag, Tooltip } from 'antd'
import { ArrowLeftOutlined, StopTwoTone } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { ColumnGroupType, ColumnType, ColumnsType } from 'antd/es/table'
import { Typography } from 'antd'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../../store/store'
import { NoParseFolders } from '../../../../components/CustomNoData/NoParseFolders'
import { setParseManagerFolder } from '../../../../store/appSlice'
import Link from 'antd/es/typography/Link'
import { colors } from '../../../../global-style/style-colors.module'


const { Title } = Typography

const TableHeaders = () => {
  const tableHeaders: ColumnsType = [
    {
      title: 'ID',
      dataIndex: 'group_id',
      render: (_, record: any) => {
        if (record.fullInfo.megagroup) {
          return <Tag style={{ minWidth: 56, display: 'flex', justifyContent: 'center' }} color="cyan">Чат</Tag>
        } else {
          return <Tag style={{ minWidth: 56, display: 'flex', justifyContent: 'center' }} color="purple">Группа</Tag>
        }
      }
    },
    {
      title: 'Название группы',
      dataIndex: 'group_id',
      render: (_, record: any) => <div>{record.fullInfo.title}</div>
    },
    {
      title: 'Ссылка',
      dataIndex: 'group_id',
      width: '30%',
      render: (_, record: any) => {
        return (
          <div>
            {record.group_name ? (
              <Link href={`https://t.me/${record.group_name}`}>
                @{record.group_name}
              </Link>
            ) : (
              <div className="ml-[10px]">
                <StopTwoTone twoToneColor={colors.danger}/>
              </div>
            )}
          </div>
        )
      }
    },
    {
      title: 'Колличество участников',
      dataIndex: 'group_id',
      render: (_, record: any) => <div>{record.fullInfo.participants_count}</div>
    },
  ]
  return tableHeaders
}

export const Groups = () => {
  const dispatch = useDispatch()

  const currentFolderKey = useSelector((state: StoreState) => state.app.parseManagerFolder)
  const parseFolders = useSelector((state: StoreState) => state.user.userParsingFolders)
  const currentParseFolder = parseFolders?.filter((folder) => folder.key === currentFolderKey)[0]

  return (
    <div>
      <MCard className='w-full p-2'>
        <div className="flex flex-col gap-7">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 mr-2">
              <Title style={{ margin: '0 0' }} level={4}>{currentParseFolder?.title}</Title>
            </div>
            <div className="flex gap-3">
              <Tooltip title='Назад к папкам'>
                <Button 
                  className='border-[0px] shadow-md' 
                  size='large' 
                  shape="circle" 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => dispatch(setParseManagerFolder(null))}
                />
              </Tooltip>
            </div>
          </div>
          
          <div>
            <ConfigProvider renderEmpty={NoParseFolders}>
              <Table
                style={{ margin: '0 0' }}
                size='small'
                columns={TableHeaders() as (ColumnGroupType<object> | ColumnType<object>)[]}
                dataSource={currentParseFolder?.groups || []}
                pagination={{ pageSize: 15 }}
              />
            </ConfigProvider> 
          </div>
        </div>
      </MCard>
    </div>
  )
}

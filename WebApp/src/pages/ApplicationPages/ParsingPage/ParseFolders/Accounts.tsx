import { useState } from 'react'
import { MCard } from '../../../../components/Card/MCard'
import { Button, ConfigProvider, Table, Tooltip } from 'antd'
import { ArrowLeftOutlined, StopTwoTone } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { ColumnGroupType, ColumnType, ColumnsType } from 'antd/es/table'
import { Typography } from 'antd'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../../store/store'
import { NoParseFolders } from '../../../../components/CustomNoData/NoParseFolders'
import { setParseManagerFolder } from '../../../../store/appSlice'
import { colors } from '../../../../global-style/style-colors.module'
import Link from 'antd/es/typography/Link'


const { Title } = Typography

const TableHeaders = () => {
  const tableHeaders: ColumnsType = [
    {
      title: 'ID',
      dataIndex: 'account_id',
      render: (_, record: any) => <div>{record.fullInfo.id}</div>
    },
    {
      title: 'Ник',
      dataIndex: 'account_id',
      render: (_, record: any) => {
        <div>{record.fullInfo.username}</div>
        return (
          <div>
            {record.fullInfo.username ? (
              <Link href={`https://t.me/${record.fullInfo.username}`}>
                @{record.fullInfo.username}
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
      title: 'Имя',
      dataIndex: 'account_id',
      render: (_, record: any) => <div>{record.fullInfo.first_name ? (`${record.fullInfo.first_name}`) : ('-')}</div>
    },
    {
      title: 'Фамилия',
      dataIndex: 'account_id',
      render: (_, record: any) => <div>{record.fullInfo.last_name ? (`${record.fullInfo.last_name}`) : ('-')}</div>
    },
    {
      title: 'Телефон',
      dataIndex: 'account_id',
      render: (_, record: any) => 
          record.fullInfo.phone ? (
            <div>{record.fullInfo.phone}</div>
          ) : (
            <StopTwoTone twoToneColor={colors.danger}/>
          )
    },
  ]
  return tableHeaders
}

export const Accounts = () => {
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
              {/* <MSelect 
                size='large'
                defaultValue="Страна"
                style={{ width: 200 }}
                onChange={handleChange}
                options={options}
              />
              <MSearch 
                placeholder="Поиск по папкам"
                allowClear
                enterButton="Поиск"
                size="large"
                onSearch={() => console.log('search)}
              /> */}
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
                dataSource={currentParseFolder?.accounts || []}
                pagination={{ pageSize: 15 }}
                
              />
            </ConfigProvider> 
          </div>
        </div>
      </MCard>
    </div>
  )
}

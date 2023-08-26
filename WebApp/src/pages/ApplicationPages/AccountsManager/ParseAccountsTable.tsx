import React, { useState, useRef } from 'react'
import type { ColumnType } from 'antd/es/table';
import { 
  Tag, 
  InputRef, 
  Space, 
  Input, 
  Button, 
  Dropdown, 
  message, 
  Avatar,
  Badge
} from 'antd';
import { 
  CheckSquareOutlined, 
  ClockCircleTwoTone, 
  DeleteOutlined, 
  EditOutlined, 
  EnterOutlined, 
  MoreOutlined, 
  SearchOutlined, 
  UploadOutlined, 
  UserOutlined
} from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import type { MenuProps } from 'antd';
import { colors } from '../../../global-style/style-colors.module';
import { dateToFormat } from '../../../utils/dateToFormat';


export interface IAccountsData {
  key: React.Key,
  avatar: string,
  phoneNumber: string,
  resting: string,
  userName: string,
  firstName?: string,
  lastName?: string,
  secondFacAith: string,
  proxy: string,
  latestActivity: { $date: number | Date },
  status: string,
  telegramSession: string,
  apiId?: number,
  apiHash?: string,
}

type DataIndex = keyof IAccountsData;

const GetColumnSearchProps = ({data, placeholder}: {data: DataIndex, placeholder: string}) => {
  const [searchText, setSearchText] = useState<string>('')
  const [searchedColumn, setSearchedColumn] = useState<string>('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  
  const getColumnSearchProps = ({dataIndex, placeholderProp}: {dataIndex: DataIndex, placeholderProp: string}): ColumnType<IAccountsData> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={placeholderProp}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            onClick={() => {clearFilters && handleReset(clearFilters); handleSearch([''] as string[], confirm, dataIndex)}}
            size="small"
            style={{ width: 90 }}
          >
            Вернуть
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Поиск
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => 
      (record[dataIndex] as any)
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  return getColumnSearchProps({dataIndex: data, placeholderProp: placeholder})
}

export const TableHeaders = () => {
  /**
   * Items for `dropdown menu` of each table column
   */
  const dropDownItems: MenuProps['items'] = [
    {
      key: '0',
      label: 'Редактировать',
      icon: <EditOutlined />
    },
    {
      key: '1',
      label: 'Переместить',
      icon: <div style={{ transform: 'rotate(180deg)' }}><EnterOutlined /></div>,
    },
    {
      key: '2',
      label: 'Экспорт"',
      icon: <UploadOutlined />,
    },
    {
      key: '3',
      label: 'Валидность',
      icon: <CheckSquareOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: 'Удалить',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ]
  
  /**
   * Setting table body for `accounts` table
   */
  const tableHeaders: any = [
    {
      title: 'Аватар',
      dataIndex: 'avatar',
      render: (avatar: string, record: any) => (
        <span className='w-full h-full'>
          <Badge dot={record.status === 'active' ? true : false} status='success' offset={[-7, 28]}>
            {avatar ? (
              <Avatar src={avatar} />
            ) : (
              <Avatar style={{ background: colors.accent }} icon={<UserOutlined />} />
            )}
          </Badge>
        </span>
      ),
    },
    {
      title: 'Номер',
      dataIndex: 'phoneNumber',
      editable: true,
      ...GetColumnSearchProps({data: 'phoneNumber', placeholder: 'Поиск по номеру'})
    },
    {
      title: 'Отлёжка',
      dataIndex: 'resting',
      render: (resting: string) => (
        <div className="flex gap-2">
          {Number(new Date(resting)) * 1000} 
          <ClockCircleTwoTone twoToneColor={colors.primary} />
        </div>
      )
    },
    {
      title: 'ФИО',
      dataIndex: 'firstName',
      editable: true,
      ...GetColumnSearchProps({data: 'firstName', placeholder: 'Поиск по ФИО'}),
    },
    {
      title: '2ФА',
      dataIndex: 'secondFacAith'
    },
    {
      title: 'Proxy',
      editable: true,
      dataIndex: 'proxy'
    },
    {
      title: 'Поседнее изменение',
      dataIndex: 'latestActivity',
      render: (latestActivity: Date) => {
        const date = dateToFormat(latestActivity)
        return (
          <p>{date}</p>
        )
      }
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (tags: any) => (
        <div className='flex items-center justify-between'>
          <div>
            {[tags].map((tag: string) => {
              let color: string = 'green'
              if (tag === 'active') {color = 'green'}
              if (tag === 'banned') {color = 'red'}
              if (tag === 'resting') {color = 'yellow'}
    
              return <Tag color={color || 'green'} key={tag}>{tag || 'active'}</Tag>
            })}
          </div>
          <Dropdown menu={{ items: dropDownItems, onClick }} trigger={['click']}>
            <Button style={{ borderWidth: '0px', boxShadow: 'inherit' }} shape="circle" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      ),
      filters: [
        {
          text: 'active',
          value: 'active'
        },
        {
          text: 'banned',
          value: 'banned'
        },
        {
          text: 'resting',
          value: 'resting'
        }
      ],
      onFilter: (value: any, record: any) => record.status.indexOf(value as string) === 0,
    }
  ]
  
  const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`)
  }
  
  return tableHeaders
}


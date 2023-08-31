import type { ColumnsType } from 'antd/es/table'
import { useDispatch } from 'react-redux'
import styles from '../../ProxyManager/style.module.css'
import groupFolder from "../../../../images/groupFolder.svg";
import { colors } from '../../../../global-style/style-colors.module';
import { Button, Dropdown, Typography } from 'antd';
import type { IModuleSenderConfig } from '../../../../store/types';
import { DeleteOutlined, MoreOutlined, ToTopOutlined } from '@ant-design/icons';
import axios from "axios";
import { useSelector } from 'react-redux';
import { StoreState } from '../../../../store/store';
import { setDistributionFolders } from '../../../../store/appSlice';

const { Title } = Typography;


export const TableHeaders = () => {
  const userMail = useSelector((state: StoreState) => state.user.mail)
  const dispatch = useDispatch();

  const deleteFolderHandler = async (mail: string | null, folderId: string) => {
    if (!mail) return;
    try {
      const apiUrl = `${process.env.REACT_APP_SERVER_END_POINT}/moduleSender/delete-distribution/${mail}/${folderId}`
      const currentFolders = await axios.get(apiUrl);
      dispatch(setDistributionFolders(currentFolders.data));
    } catch (err) {
      console.error(err)
    }
  }

  const tableHeaders: ColumnsType<IModuleSenderConfig> = [
    {
      title: 'Папка',
      dataIndex: 'folder',
      render: (_, record) => (
        <div className='flex items-center justify-between'>
          <div 
            className={`${styles.folder_style} w-full flex items-center gap-5 p-2 rounded-md hover:bg-slate-50`}
            // onClick={() => dispatch(setParseManagerFolder(record.key))}
          >
            <div className="h-[110px] object-contain">
              <img src={groupFolder} className='w-full h-full' alt='groupFolder'/>
            </div>
            <div className="flex flex-col gap-1">
              <Title style={{ margin: '0 0', color: colors.font }} level={4}>{record.title}</Title>
              <Title style={{ margin: '0 0', fontWeight: '400', color: colors.dopFont }} level={5}>{record.description}</Title>
              <Title style={{ margin: '0 0', fontWeight: '400', color: colors.dopFont }} level={5}>{record.messages?.length}</Title>
            </div>
          </div>
        </div>
      )  
    },
    {
      title: 'Действия',
      dataIndex: 'actions',
      render: (_, record) => (
        <div className='flex justify-end'>
          <Dropdown
            menu={
              {
                items: [
                  {
                    key: '1',
                    label: 'Запустить',
                    icon: <ToTopOutlined />,
                    onClick: () => console.log(this)
                  },
                  {
                    type: 'divider'
                  },
                  {
                    key: '2',
                    label: 'Удалить',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => deleteFolderHandler(userMail, record._id),
                  },
                ]
              }
            }
            trigger={['click']}
          >
            <Button style={{ borderWidth: '0px', boxShadow: 'inherit' }} shape="circle" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      )
    }
  ]

  return tableHeaders
}

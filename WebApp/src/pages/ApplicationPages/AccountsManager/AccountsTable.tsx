import React, { useState } from 'react'
import { 
  ArrowLeftOutlined, 
  CloseOutlined, 
  ContainerOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  ExclamationCircleFilled 
} from '@ant-design/icons'
import { MCard } from '../../../components/Card/MCard'
import { Table, Button, Tooltip, Modal, message } from 'antd'
import { TableHeaders } from './ParseAccountsTable'
import { useDispatch } from 'react-redux'
import { setAccountsManagerFolder } from '../../../store/appSlice'
import { IAccountsData } from './ParseAccountsTable'
import { AnimatePresence, motion } from 'framer-motion'
import { notificationHandler } from '../../../components/notification'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'


const { confirm } = Modal

export const AccountsTable = () => {
  const dispatch = useDispatch()
  const [selectedFolders, setSelectedFolders] = useState<IAccountsData[]>([])
  const [selectionType, setSelectionType] = useState<boolean>(false)

  const openedAccountsFolder = useSelector((state: StoreState) => state.app.accountsManagerFolder)
  const accountsManagerTableData = useSelector((state: StoreState) => state.user.userManagerFolders)
  const currentFolderData = accountsManagerTableData?.find((folder) => folder.key === openedAccountsFolder)

  const rowSelection = {
    onChange: (selectedRowKey: React.Key[], selectedRows: IAccountsData[]) => {
      setSelectedFolders(selectedRows)
      // console.log(`selectedRowKeys: ${selectedRowKey}, selectedRows: ${selectedRows}`)
    },
    getCheckboxProps: (record: IAccountsData) => ({
      disabled: record.key === 'Disabled User', // Column configuration not to be checked
      key: record.key,
    }),
  }

  const exportSelectedAccounts = () => {
    if (selectedFolders.length) {
      notificationHandler({
        type: 'success',
        msg: 'Аккаунты успешно экспортированы',
        place: 'bottomRight'
      })
      setSelectionType(false)
    } else {
      message.warning('Не выбрано ни одного аккаунта')
    }
  }

  const deleteSelectedAccounts = () => {
    if (selectedFolders.length) {
      confirm({
        title: 'Удаление выделенных аккаунтов',
        icon: <ExclamationCircleFilled />,
        centered: true,
        content: 'Вы уверены, что хотите безвозвратно удалиь выделенные аккаунт?',
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Отмена',
        onOk() {
          notificationHandler({
            type: 'success',
            msg: 'Аккаунты успешно удалены',
            place: 'bottomRight'
          })
          setSelectedFolders([])
          setSelectionType(false)
        }
      })
    } else {
      message.warning('Не выбрано ни одного аккаунта')
    }
  }


  return (
    <MCard className='h-full py-2 px-2'>
      <div className="flex flex-col gap-7">
        <div className="flex justify-between">
          <div className="flex  gap-3">
            <Button 
              size='large' shape="round"
              icon={<ArrowLeftOutlined />}
              className='border-[0px] shadow-md' 
              onClick={() => dispatch(setAccountsManagerFolder(null))} 
            >К папкам</Button>
          </div>
          <div className="flex  gap-3">
            {selectionType ? (
              <AnimatePresence>
                <motion.div
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, type: 'spring', delay: 0.1 }}
                  className='flex gap-3'
                >
                  <Tooltip title='Удалить выделенное'>
                    <Button 
                      danger 
                      size='large' 
                      shape="circle" 
                      icon={<DeleteOutlined />} 
                      className={`border-[0px] shadow-md`} 
                      onClick={() => deleteSelectedAccounts()}
                    />
                  </Tooltip>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, type: 'spring' }}
                  className='flex gap-3'
                >
                  <Tooltip title='Экспорт в архив'>
                    <Button 
                      size='large' 
                      shape="circle" 
                      icon={<ContainerOutlined />} 
                      className={`border-[0px] shadow-md`} 
                      onClick={() => exportSelectedAccounts()}
                    />
                  </Tooltip>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className='flex gap-3'>
                <div className="w-[40px] h-[40px]" />
                <div className="w-[40px] h-[40px]" />
              </div>
            )}
            <Button 
              className='border-[0px] shadow-md' 
              size='large' 
              shape="circle" 
              icon={selectionType ? <CloseOutlined /> : <EditOutlined />} 
              onClick={() => setSelectionType(!selectionType)} 
            />
            <Button disabled type='primary' size='large'>Проверить</Button>
          </div>
        </div>
        <Table
          size='large'
          pagination={{ pageSize: 999 }}
          rowSelection={selectionType ? { type: 'checkbox', ...rowSelection } : undefined}
          columns={TableHeaders()}
          dataSource={ currentFolderData?.accounts || []}
          className='h-full'
        />
      </div>
    </MCard>
  )
}

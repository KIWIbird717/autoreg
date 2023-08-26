import React, { useState } from 'react'
import { MCard } from '../../../components/Card/MCard'
import { Table, Button, Tooltip, Modal, message, ConfigProvider } from 'antd'
import { TableHeaders } from './ParseAccountsTable'
import { ArrowLeftOutlined, CloseOutlined, ContainerOutlined, DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setProxyManagerFolder } from '../../../store/appSlice'
import { IProxyData } from './ParseAccountsTable'
import { AnimatePresence, motion } from 'framer-motion'
import { notificationHandler } from '../../../components/notification'
import { StoreState } from '../../../store/store'
import { NoDataProxies } from '../../../components/CustomNoData/NoDataProxies'
import { ModalAddNewProxy } from './ModalAddNewProxy'


const { confirm } = Modal

export const ProxiesTable = () => {
  const dispatch = useDispatch()
  const [selectedFolders, setSelectedFolders] = useState<IProxyData[]>([])
  const [selectionType, setSelectionType] = useState<boolean>(false)

  const proxyTableData = useSelector((state: StoreState) => state.user.userProxyFolders)
  const openedProxyFolder = useSelector((state: StoreState) => state.app.proxyManagerFolder)
  const currentFolderData = proxyTableData?.find((folder) => folder.key === openedProxyFolder)

  const [modal, setModal] = useState<boolean>(false)

  const rowSelection = {
    onChange: (selectedRowKey: React.Key[], selectedRows: IProxyData[]) => {
      setSelectedFolders(selectedRows)
      // console.log(`selectedRowKeys: ${selectedRowKey}, selectedRows: ${selectedRows}`)
    },
    getCheckboxProps: (record: IProxyData) => ({
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
            <Button onClick={() => dispatch(setProxyManagerFolder(null))} className='border-[0px] shadow-md' size='large' shape="round" icon={<ArrowLeftOutlined />}>К папкам</Button>
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
                    <Button danger className={`border-[0px] shadow-md`} size='large' shape="circle" icon={<DeleteOutlined />} onClick={() => deleteSelectedAccounts()}/>
                  </Tooltip>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, type: 'spring' }}
                  className='flex gap-3'
                >
                  <Tooltip title='Экспорт в архив'>
                    <Button className={`border-[0px] shadow-md`} size='large' shape="circle" icon={<ContainerOutlined />} onClick={() => exportSelectedAccounts()}/>
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
            <Tooltip title='Добавить proxy'>
              <Button 
                className='border-[0px] shadow-md' 
                size='large' 
                shape="circle" 
                icon={<PlusOutlined />}
                onClick={() => setModal(true)}
              />
            </Tooltip>
            <ModalAddNewProxy 
              open={modal}
              onCancel={() => setModal(false)}
              onOk={() => setModal(false)}
            />
          </div>
        </div>
        <ConfigProvider renderEmpty={NoDataProxies}>
          <Table
            size='large'
            pagination={{ pageSize: 999 }}
            rowSelection={selectionType ? { type: 'checkbox', ...rowSelection } : undefined}
            columns={TableHeaders()}
            dataSource={currentFolderData?.proxies || []}
            className='h-full'
          />
        </ConfigProvider>
      </div>
    </MCard>
  )
}

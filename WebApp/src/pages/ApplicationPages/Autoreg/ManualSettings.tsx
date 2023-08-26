import { Button, Col, Row, Typography, message } from 'antd'
import { BookOutlined, CheckOutlined, FolderOpenFilled, FolderOpenOutlined, InboxOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { colors } from '../../../global-style/style-colors.module'
import { motion } from 'framer-motion'
import { Modal } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'  
import { StoreState } from '../../../store/store'
import tableCard from '../../../images/tableCard.svg'
import { SliderDriwer } from '../../../components/SliderDrawer/SliderDriwer'
import styles from './folder-selection-style.module.css'
import { IHeaderType } from '../AccountsManager/Collumns'
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload'
import { ModalAddNewFolder } from './ModalAddNewFolder'
import Dragger from 'antd/es/upload/Dragger'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserManagerFolders } from '../../../store/userSlice'


const { Title } = Typography

type propsType = {
  key: number | string,
  current: number | string,
  value: number | string,
}

type FilterPairsType<T> = { session: UploadFile<T>, json: UploadFile<T> } | undefined

export const ManualSettings = ({current, value}: propsType) => {
  const dispatch = useDispatch()
  const userMail = useSelector((state: StoreState) => state.user.mail)
  const accaountsFolders: IHeaderType[] | null = useSelector((state: StoreState) => state.user.userManagerFolders)

  const [modal, setModal] = useState<boolean>(false)
  const [newFolderModal, setNewFolderModal] = useState<boolean>(false)

  const [selectedFolder, setSelectedFolder] = useState<null | IHeaderType>(null)

  // Uploaded files
  const [fileListRaw, setFileListRaw] = useState<UploadFile<any>[]>([])

  const [buttonLoading, setButtonLoading] = useState<boolean>(false)


  const resetAllData = (): void => {
    setSelectedFolder(null)
    setFileListRaw([])
    setButtonLoading(false)
  }

  const createNewAccount = async (): Promise<void> => {
    // Validate fields
    if (!selectedFolder) {
      message.error('Укажите папку для сохранения акаунтов')
      return
    }
    if (!fileListRaw) {
      message.error('Добавте файлы для загрузки')
      return
    }

    setButtonLoading(true)

    // Set up form data
    const formData = new FormData()
    formData.append('mail', userMail as unknown as Blob)
    formData.append('folder_key', selectedFolder.key as unknown as Blob)
    fileListRaw.forEach((file) => {
      formData.append('files', file.originFileObj as unknown as Blob)
    })
    try {
      const url = `${process.env.REACT_APP_PYTHON_SERVER_END_POINT}/api/accounts/sessions/add/folder`
      const res = await axios.post(url, formData)

      if (res.status == 200 && res.data.body && res.data.body.length > 0) {
        message.success('Акаунты успешно добавлены')
        const recievedFolders = res.data.body.map((folder: string) => {
          const folderParsed = JSON.parse(folder)
          return { ...folderParsed, _id: folderParsed._id.$oid, latestActivity: folderParsed.latestActivity.$date }
        })
        dispatch(setUserManagerFolders(recievedFolders))
      } else {
        message.error('Ошибка при добавлении акаунтов')
      }
      setButtonLoading(false)
      resetAllData()
    } catch (err) {
      console.error(err)
      message.error('Ошибка при добавлении акаунтов')
      setButtonLoading(false)
      resetAllData()
    }

  }

  const props: UploadProps = {
    multiple: true,
    onRemove: (file) => {
      if (!fileListRaw) return
      const newFileList = fileListRaw.filter((f) => f !== file)
      setFileListRaw(newFileList)
    },
    onChange: (e: any) => setFileListRaw(e.fileList),
    beforeUpload: () => {
      return false
    },
  }

  return (
    <motion.div 
      className='min-w-full'
      initial={value === current ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      animate={value === current ? { opacity: 1, scale: 1 } : 'null'}
      transition={{ duration: 0.2 }}
    >
      <ModalAddNewFolder 
        open={newFolderModal}
        onCancel={() => setNewFolderModal(false)}
        onOk={() => setNewFolderModal(false)}
        setSelectedFolder={(e) => setSelectedFolder(e)}
      />
      <Modal 
        style={{ borderRadius: 20 }}
        title="Выбор папки с аккаунтами" 
        open={modal} 
        onOk={() => setModal(false)} 
        onCancel={() => setModal(false)}
        footer={[
          <Button
            icon={<PlusOutlined />}
            type='primary'
            onClick={() => {setModal(false); setNewFolderModal(true)}}
          >
            Создать новую папку
          </Button>
        ]}
      >
        <div className="flex flex-col gap-3 my-5">
          <SliderDriwer 
            dataSource={accaountsFolders || []}
            open={true}
            visibleAmount={3}
            render={(el) => (
              <div 
                key={el.key} 
                className={`${styles.slider_driwer_folder} flex justify-between w-full rounded-2xl p-3 bg-white`}
                onClick={() => {setSelectedFolder(el); setModal(false)}}
              >
                <div className="flex items-center gap-5">
                  <div className='h-[110px] object-contain'>
                    <img className='w-full h-full' src={tableCard} alt='icon'/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Title style={{ margin: '0px 0px' }} level={4}>{el.folder}</Title>
                    <Title style={{ margin: '0px 0px', fontWeight: '400' }} type='secondary' level={5}>{el.dopTitle}</Title>
                    <div className="flex gap-1 items-start">
                      <Title className='m-0' level={5}>{el.accounts.length}</Title>
                      <UserOutlined className='my-1 mt-[5px]' />
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </Modal>

      <div className="flex flex-col justify-between">
        <div>
          {selectedFolder ? (
            <motion.div 
              className="flex justify-between items-center"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex items-center gap-3 w-full mb-5'>
                <div className="object-contain h-[130px]">
                  <img className='h-full' src={tableCard} alt='table card'/>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Title 
                    level={3} 
                    style={{ margin: '0px 0px', width: '100%' }}
                    className={styles.folder_styles}
                  >
                    {selectedFolder.folder}
                  </Title>
                  <Title 
                    level={5} 
                    style={{margin: '5px 5px', fontWeight: 'normal', width: '100%', color: colors.dopFont}}
                  >
                    {selectedFolder.dopTitle}
                  </Title>
                </div>
              </div>
              <Button className='mr-5' icon={<FolderOpenOutlined />} onClick={() => setModal(true)}>Изменить</Button>
            </motion.div>
            ) : (
            <div className='flex items-center gap-3 w-full mb-5'>
              <Button onClick={() => setModal(true)} type='dashed' className='w-[160px] h-[120px]'>
                <FolderOpenFilled style={{ fontSize: 50 }} />
              </Button>
              <Title level={3} style={{ margin: 0 }}>Выберите папку</Title>
            </div>
          )}

          <div className="">
            <Row gutter={20} align={'top'}>
              <Col span={14}>
                <Dragger {...props} fileList={fileListRaw}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Нажмите или перетащите файл в эту область, чтобы загрузить</p>
                  <p className="ant-upload-hint">
                    Перетащите пары файлов с расширениями .json и .session
                  </p>
                </Dragger>
              </Col>
              <Col span={10} className='h-full'>
                <div className="mt-[60px] max-w-[270px] flex flex-col h-full justify-center gap-3">
                  <p style={{ margin: '0 0' }}>Если у вас возникли проблемы с загрузкой акаунтов, можете прочитать инструкцию ниже.</p>
                  <div className="flex items-center gap-3">
                    <Button type='link' icon={<BookOutlined />}>Инструкция</Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <div className="w-full flex justify-between items-center">
          {selectedFolder ? (
            <Button 
              danger 
              onClick={() => resetAllData()}
              type='link'
            >
              Отменить
            </Button>
          ) : (
            <div className="div"></div>
          )}
          <Button loading={buttonLoading} onClick={() => createNewAccount()} icon={<CheckOutlined />} size='large' type='primary'>Добавить аккаунт</Button>
        </div>
      </div>
    </motion.div>
  )
}

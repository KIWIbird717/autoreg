import React, { useContext, useEffect, useRef } from 'react'
import { AccordionStyled } from '../Accordion/AccordionStyled'
import { Button, Col, ConfigProvider, Divider, Form, FormInstance, Input, InputRef, Modal, Popover, Row, Table, message } from 'antd'
import { BugOutlined, BuildOutlined, DeleteOutlined, FolderOpenOutlined, InfoCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { useState } from 'react'
import { IParseFolders } from '../../../../store/types'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../../store/store'
import groupFolder from '../../../../images/groupFolder.svg'
import accountsFolder from '../../../../images/accountsFolder.svg'
import botFolder from '../../../../images/tableCard.svg'

import { ModalAddNewParsingFolder } from '../ParseFolders/ModalAddNewParsingFolder'
import { SliderDriwer } from '../../../../components/SliderDrawer/SliderDriwer'
import styles from '../../Autoreg/folder-selection-style.module.css'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { NoKeywordsData } from '../../../../components/CustomNoData/NoKeywordsData'
import { IHeaderType } from '../../AccountsManager/Collumns'
import { parsingFoldersFromDB } from '../ParseFolders/Folders'
import TaskCompliteWatcher from '../../../../utils/app/taskCompliteWatcher'

const { Title } = Typography


const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string
  keyword: string
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex].replace(/\s/g, '') })
  };

  const save = async () => {
    try {
      const values = await form.validateFields()

      const validValues = {
        keyword: values.keyword.replace(/\s/g, '')
      }

      toggleEdit()
      handleSave({ ...record, ...validValues })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>;
}



type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: number;
  keyword: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;


interface IProps {
  id: number,
  expanded: string | boolean,
  onChange: (event: React.SyntheticEvent<Element, Event>, expanded: boolean) => void,
}

export const ParseByKeywords = ({id, expanded, onChange}: IProps) => {
  const dispatch = useDispatch()
  const userMail = useSelector((state: StoreState) => state.user.mail)
  const pasingFoldersRaw: IParseFolders[] | null = useSelector((state: StoreState) => state.user.userParsingFolders)
  const accountsFolders = useSelector((state: StoreState) => state.user.userManagerFolders)

  const [newFolderModal, setNewFolderModal] = useState<boolean>(false)
  const [selectedFolder, setSelectedFolder] = useState<IParseFolders | null>(null)
  const [selectedAccountsFolder, setselectedAccountsFolder] = useState<IHeaderType | null>(null)

  // Modal
  const [modal, setModal] = useState<boolean>(false)
  const [modalBots, setModalBots] = useState<boolean>(false)

  // Buttons
  const [buttonError, setButtonError] = useState<boolean>(false)
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)
  const [buttonBotSelection, setButtonBotSelection] = useState<boolean>(false)

  //chat link
  const [chatLink, setChatLink] = useState<{status: "error" | "warning" | "", link: string}>({status: "", link: ""})

  // Table data
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [count, setCount] = useState(0)

  const resetFields = () => {
    setDataSource([])
    setSelectedFolder(null)
    setButtonError(false)
    setButtonLoading(false)
    setChatLink({status: "", link: ""})
    setButtonBotSelection(false)
    setselectedAccountsFolder(null)
  }

  const runParsing = async () => {
    const keywordsArray: string[] = dataSource.map((keyword) => keyword.keyword)
    const keywords: string = keywordsArray.join(',')

    if (keywords.length < 1) {
      message.warning('Добавте ключевые слова')
      return
    }
    if (!chatLink.link) {
      setChatLink({status: "error", link: ""})
      return
    }
    if (!selectedAccountsFolder) {
      setButtonBotSelection(true)
      setTimeout(() => {
        setButtonBotSelection(false)
      }, 2_000)
      return
    }
    if (!selectedFolder) {
      setButtonError(true)
      setTimeout(() => {
        setButtonError(false)
      }, 2000)
      return
    }
    if (selectedFolder.type != 'accounts') {
      message.error('Выберите папку типа \'Акаунты\'')
      setButtonError(true)
      setTimeout(() => {
        setButtonError(false)
      }, 2000)
      return
    }
    if (!accountsFolders || accountsFolders && accountsFolders.length < 1) {
      message.error('Нет свободных номеров')
      return
    }

    // set button loading
    setButtonLoading(true)

    const url = `${process.env.REACT_APP_PYTHON_SERVER_END_POINT}/api/parser/chat-members`
    try {
      const res = await axios.get(url, {
        params: {
          mail: userMail,
          folder: selectedAccountsFolder._id,
          folder_to_save: selectedFolder._id,
          chat: chatLink.link,
          keywords: keywords,
        }
      })

      console.log(res)
      if (res.status == 200) {
        message.info('Начат парсинг аккаунтов. Это может занять около 30 минут')
        // Run task complite watcher util
        const taskStatus = await TaskCompliteWatcher(res.data.task_id);
        if (taskStatus === 'success') {
          parsingFoldersFromDB(userMail as string, dispatch)
          message.success('Парсинг аккаунтов завершен')
          setButtonLoading(false)
          resetFields()
        } else {
          setButtonLoading(false);
          message.error('Ошибка при парсинге акаунтов');
        }
      } else {
        message.error('Ошибка при парсинге акаунтов')  
        setButtonLoading(false)
      }
    } catch (err) {
      setButtonLoading(false)
      message.error('Ошибка при парсинге акаунтов')
      console.error(err)
    }
  }

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      dataIndex: 'keyword',
      width: '90%',
      editable: true,
    },
    {
      dataIndex: 'key',
      render: (_, record: any) =>
        dataSource.length >= 1 ? (
          <Button 
            style={{ borderWidth: '0px', boxShadow: 'inherit' }} 
            shape="circle" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.key)}
          />
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      keyword: 'Слово',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });


  return (
    <div className="div" style={{ lineHeight: 0 }}>
      <ModalAddNewParsingFolder 
        open={newFolderModal}
        onCancel={() => setNewFolderModal(false)}
        onOk={() => setNewFolderModal(false)}
        setSelectedFolder={setSelectedFolder}
        folder='accounts'
      />

      <Modal 
        style={{ borderRadius: 20 }}
        title="Выбор папки с аккаунтами" 
        open={modalBots} 
        onOk={() => setModalBots(false)} 
        onCancel={() => setModalBots(false)}
        footer={[
          <Button
            key={1} // Чтобы react не ругался на отсутствие key in map function
            onClick={() => setModalBots(false)}
          >
            Отмена
          </Button>
        ]}
      >
        <div className="flex flex-col gap-3 my-5">
        <SliderDriwer 
            dataSource={accountsFolders || []}
            open={true}
            visibleAmount={3}
            render={(el) => (
              <div 
                key={el.key} 
                className={`${styles.slider_driwer_folder} flex justify-between w-full rounded-2xl p-3 bg-white`}
                onClick={() => {setselectedAccountsFolder(el); setModalBots(false)}}
              >
                <div className="flex items-center gap-5">
                  <div className='h-[110px] object-contain'>
                    <img className='w-full h-full' src={botFolder} alt='icon'/>
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

      <Modal 
        style={{ borderRadius: 20 }}
        title="Выбор папки для парсинга" 
        open={modal} 
        onOk={() => setModal(false)} 
        onCancel={() => setModal(false)}
        footer={[
          <Button
            key={1}
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
            dataSource={pasingFoldersRaw || []}
            open={modal}
            visibleAmount={3}
            render={(el) => (
              <div 
                key={el.key} 
                className={`${styles.slider_driwer_folder} flex justify-between w-full rounded-2xl p-3 bg-white`}
                onClick={() => {setSelectedFolder(el); setModal(false)}}
              >
                <div className="flex items-center gap-5">
                  <div className='h-[110px] object-contain'>
                    <img className='w-full h-full' src={el.type === 'accounts' ? accountsFolder : groupFolder} alt='icon'/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Title style={{ margin: '0px 0px' }} level={4}>{el.title}</Title>
                    <Title style={{ margin: '0px 0px', fontWeight: '400' }} type='secondary' level={5}>{el.dopTitle}</Title>
                    <div className="flex gap-1 items-start">
                      {el.type == 'accounts' ? (
                        <Title className='m-0' level={5}>{el.accounts?.length}</Title>
                      ) : (
                        <Title className='m-0' level={5}>{el.groups?.length}</Title>
                      )}
                      <UserOutlined className='my-1 mt-[5px]' />
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </Modal>

      <AccordionStyled
        title={'Парсинг юзеров по ключевым словам'}
        dopTitle={'Парсинг по словам из описания профиля аккаунта'}
        id={id}
        expanded={expanded}
        onChange={onChange}
      >

        <div className="m-2 flex flex-col gap-4">
          <div>
            <Row gutter={20}>
              <Col span={12}>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex gap-2 items-center">
                    <Title level={5} style={{ margin: '0 0' }}>Ссылка на телеграм чат</Title>
                    <Popover className='cursor-pointer' title="Ссылка на телеграм чат" content='Ссылку на группу или чат можно взять, нажав "троеточие" -> "info"'>
                      <InfoCircleOutlined />
                    </Popover>
                  </div>
                  <Input
                    size='large'
                    placeholder='Ссылка на телеграм чат'
                    status={chatLink?.status || ""} 
                    value={chatLink?.link}
                    onChange={(e) => setChatLink({status: "", link: e.currentTarget.value})}
                  />
                </div>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: '0 0' }}/>

          <div className="w-full flex flex-col gap-1">
            <div className="w-full flex justify-between">
              <div className="flex gap-2 items-center">
                <Title level={5} style={{ margin: '0 0' }}>Ключевые слова</Title>
                <Popover className='cursor-pointer' title="Ключевые слова" content="Добавьте слова для парсинга. Нажмите Добаить и измените внесенный столбец">
                  <InfoCircleOutlined />
                </Popover>
              </div>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={() => handleAdd()}
              >
                Добавить
              </Button>
            </div>
            <ConfigProvider renderEmpty={NoKeywordsData}>
              <Table 
                style={{ margin: '0 0' }}
                rowClassName={() => 'editable-row'}
                components={components}
                columns={columns as ColumnTypes}
                dataSource={dataSource}
                pagination={{ pageSize: 5 }}
              />
            </ConfigProvider>
          </div>

          <Divider style={{ margin: '0 0' }}/>

          <div className="div">
            <Row gutter={20}>
              <Col span={12}>
                {selectedAccountsFolder ? (
                  <div className="flex gap-2">
                    <div className="h-[40px] object-contain">
                      <img className='w-full h-full' src={botFolder}/>
                    </div>
                    <Title level={4} style={{margin: '0 0', fontWeight: '500', cursor: 'default'}}>{selectedAccountsFolder.folder}</Title>
                  </div>
                ) : (
                  <Button 
                    type="dashed"
                    size='large'
                    icon={<BugOutlined />}
                    danger={buttonBotSelection}
                    onClick={() => setModalBots(true)}
                  >Боты для парсинга</Button>
                )}
              </Col>
              <Col span={12} className='flex items-end'>
                {selectedFolder ? (
                  <div className="flex gap-2">
                    <div className="h-[40px] object-contain">
                      <img className='w-full h-full' src={selectedFolder.type === 'accounts' ? accountsFolder : groupFolder}/>
                    </div>
                    <Title level={4} style={{margin: '0 0', fontWeight: '500', cursor: 'default'}}>{selectedFolder.title}</Title>
                  </div>
                ) : (
                  <Button 
                    type="dashed"
                    size='large'
                    danger={buttonError}
                    icon={<FolderOpenOutlined />}
                    onClick={() => setModal(true)}
                  >Папка для аккаунтов</Button>
                )}
              </Col>
            </Row>
          </div>
        </div>

        <div className="m-2 mt-9 flex justify-between">
          <Button
            type='link'
            danger={true}
            disabled={dataSource.length || selectedFolder || chatLink.link || selectedAccountsFolder ? false : true}
            onClick={() => resetFields()}
          >
            Отмена
          </Button>
          <Button
            type='primary'
            size='large'
            loading={buttonLoading}
            icon={<BuildOutlined />}
            onClick={() => runParsing()}
          >
            Парсить аккаунты
          </Button>
        </div>
      </AccordionStyled>
    </div>
  )
}


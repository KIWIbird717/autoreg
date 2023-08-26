import { Input, Modal, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { IParseFolders } from '../../../../store/types';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../../../../store/store';
import groupsFolder from '../../../../images/groupFolder.svg'
import accountsFolder from '../../../../images/accountsFolder.svg'
import { setUserParsingFolders } from '../../../../store/userSlice';
import { Segmented } from 'antd'
import axios from 'axios';


interface IModalAddNewProxy {
  open: boolean,
  onOk: () => void,
  onCancel: () => void,
  setSelectedFolder?: React.Dispatch<React.SetStateAction<IParseFolders | null>>
  className?: string
  folder?: "groups" | "accounts"
}

interface IInputStatus {
  status: "" | "warning" | "error" | undefined,
  msg: string
}

export const ModalAddNewParsingFolder = ({open, onOk, onCancel, setSelectedFolder, className, folder}: IModalAddNewProxy) => {
  const dispatch = useDispatch()
  const parsingData: IParseFolders[] | null = useSelector((state: StoreState) => state.user.userParsingFolders)
  const userMail = useSelector((state: StoreState) => state.user.mail)

  const [folderTitle, setFolderTitle] = useState<string | null>('')
  const [folderDescription, setFolderDescription] = useState<string | null>('')
  const [folderType, setFolderType] = useState<'groups' | 'accounts'>('accounts')
  const [inputStatus, setInputStatus] = useState<IInputStatus>({status: "", msg: ''})
  const [textAreaStatus, setTextAreaStatus] = useState<IInputStatus>({status: "", msg: ''})

  // modal button props
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)


  useEffect(() => {
    if (folder) {
      if (folder == 'groups') {
        setFolderType('groups')
      } else {
        setFolderType('accounts')
      }
    }
  }, [])

  const resetAllData = () => {
    setFolderTitle(null)
    setFolderDescription(null)
  }

  const parsingFoldersFromDB = async (mail: string): Promise<IParseFolders[] | void> => {
    try {
      const url = `${process.env.REACT_APP_SERVER_END_POINT}/parsingFolder/get-pasing-folders/${mail}`
      if (mail) {
        const folders = await axios.get(url)
        if (folders.status === 200) {
          dispatch(setUserParsingFolders(folders.data))
          return folders.data
        } else {
          console.error('Error occured while trying handle accounts folders')
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleFolderTitle = (string: string): void => {
    if (string.toLowerCase() === 'хуй') {
      setFolderTitle(':)')
      return
    }
    if (string.toLowerCase() === 'меня всё заебало') {
      setFolderTitle('Меня тоже...')
      return
    }
    if (string.toLowerCase() === 'иди нахуй') {
      setFolderTitle('Будь повежливей')
      return
    }

    setFolderTitle(string)
  }

  const handleNewParsingFolder = async () => {
    setButtonLoading(true)
    try {
      if (folderTitle === '') {
        setInputStatus({status: "error", msg: "Введите название папки"})
        setButtonLoading(false)
        return
      }
      if (folderDescription === '') {
        setTextAreaStatus({status: "error", msg: "Введите описание папки"})
        setButtonLoading(false)
        return
      }
  
      let maxKey = Math.max(...parsingData?.map((folder) => Number(folder.key) as number) || [0]) + 1
      if (maxKey === -Infinity) { maxKey = 0 }
  
      const newParsingFolder: IParseFolders = {
        key: maxKey.toString(),
        title: folderTitle || 'Не указано',
        dopTitle: folderDescription || 'Не указано', 
        latestEdit: new Date(),
        type: folderType as "accounts" | "groups", // Уже сделана проверка выше, но IDE-шка ругается
        accounts: [],
        groups: []
      }
  
      const url = `${process.env.REACT_APP_SERVER_END_POINT}/parsingFolder/add-new-folder`
      const res = await axios.post(url, { mail: userMail, folder: newParsingFolder })
        .catch((err) => {
          console.error(err)
          if (err.response.statusText === "Internal Server Error") {
            notification['error']({
              message: 'Ошибка при внесении новой папки в базу данных',
              description: 'Сервер базы данных перегружен, поробуйте позже',
              placement: 'bottomRight'
            })
          } else {
            notification['error']({
              message: 'Ошибка при внесении новой папки в базу данных',
              description: 'Возможно ошибка сервера, попробуйте позже',
              placement: 'bottomRight'
            })
          }
          return
        })
      
      // update folder (need to get folder _id from DB)
      if (parsingData && userMail) {
        // setting up sellected folder for parsing function
        const folders = await parsingFoldersFromDB(userMail)
        const current = folders?.filter((folder) => folder.key == newParsingFolder.key)[0]
        if (current && setSelectedFolder) {
          setSelectedFolder(current)
        }
      }

      resetAllData()
      setButtonLoading(false)
      onCancel()
    } catch (err: any) {
      if (err.response.data === 'Ошибка при создании новой папки') {
        notification['error']({
          message: 'Ошибка при создании новой папки',
          description: 'Измените параметры папки или попробуйте позже. Возможно ошибка сервера',
          placement: 'bottomRight'
        })
      } else {
        notification['error']({
          message: 'Ошибка при создании новой папки',
          description: 'Измените параметры папки или попробуйте позже. Возможно ошибка сервера',
          placement: 'bottomRight'
        })
      }
      return null
    }
  }

  return (
    <Modal
      title="Новая папка"
      open={open}
      onOk={() => handleNewParsingFolder()}
      onCancel={() => {resetAllData(); onCancel()}}
      okButtonProps={{ title: 'Добавить', loading: buttonLoading }}
      cancelButtonProps={{ title: 'Отмена' }}
      okText='Добавить'
      cancelText='Отмена'
    >
    <div className={`w-[100%] my-8 flex items-center gap-4 ${className}`}>
      <div className="object-contain h-[130px]">
        <img className='h-full' src={folderType === 'accounts' ? accountsFolder : groupsFolder} alt='table card'/>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Input 
          size="large" 
          placeholder="Название папки" 
          value={folderTitle || ""}
          status={inputStatus.status}
          onChange={(e) => {setInputStatus({status: "", msg: ""});handleFolderTitle(e.currentTarget.value)}}
        />
        <TextArea
          status={textAreaStatus.status}
          value={folderDescription || ""}
          onChange={(e) => {setTextAreaStatus({status: "", msg: ""}); setFolderDescription(e.target.value)}}
          placeholder="Добавьте описание"
          autoSize={{ minRows: 2, maxRows: 5 }}
          showCount
          maxLength={50}
        />
        {folder ? (
          folder == 'groups' ? (
            <Segmented 
              style={{ width: 'fit-content' }}
              options={[{label: 'Акаунты', value: 'accounts'}, {label: 'Группы', value: 'groups'}]}
              value={'groups'}
              disabled={true}
            />
          ) : (
            <Segmented 
              style={{ width: 'fit-content' }}
              options={[{label: 'Акаунты', value: 'accounts'}, {label: 'Группы', value: 'groups'}]}
              value={'accounts'}
              disabled={true}
            />
          )
        ) : (
          <Segmented 
            style={{ width: 'fit-content' }}
            options={[{label: 'Акаунты', value: 'accounts'}, {label: 'Группы', value: 'groups'}]}
            onChange={(e) => setFolderType(e as "groups" | "accounts")}
          />
        )}
      </div>
    </div>
    </Modal>
  )
}

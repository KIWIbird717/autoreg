import React from 'react'
import TextArea from 'antd/es/input/TextArea'
import proxyCard from '../../../images/proxyFolder.svg'
import { Input, Modal } from 'antd'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StoreState } from '../../../store/store'
import { IProxyHeaderType } from './Collumns'
import { setUserProxyFolders } from '../../../store/userSlice'

interface IModalAddNewProxy {
  open: boolean,
  onOk: () => void,
  onCancel: () => void,
  className?: string
}

interface IInputStatus {
  status: "" | "warning" | "error" | undefined,
  msg: string
}

export const ModalAddNewProxyFolder = ({open, onOk, onCancel, className}: IModalAddNewProxy) => {
  const dispatch = useDispatch()
  const proxyData: IProxyHeaderType[] | null = useSelector((state: StoreState) => state.user.userProxyFolders)

  const [folderTitle, setFolderTitle] = useState<string | null>('')
  const [folderDescription, setFolderDescription] = useState<string | null>('')
  const [inputStatus, setInputStatus] = useState<IInputStatus>({status: "", msg: ''})
  const [textAreaStatus, setTextAreaStatus] = useState<IInputStatus>({status: "", msg: ''})

  const resetAllData = () => {
    setFolderTitle(null)
    setFolderDescription(null)
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

  const handleNewProxyFolder = (): void => {
    if (folderTitle === '') {
      setInputStatus({status: "error", msg: "Введите название папки"})
      return
    }
    if (folderDescription === '') {
      setTextAreaStatus({status: "error", msg: "Введите описание папки"})
      return
    }

    let maxKey = Math.max(...proxyData?.map((folder) => Number(folder.key) as number) || [0]) + 1
    if (maxKey === -Infinity) { maxKey = 0 }

    const newProxyFolder: IProxyHeaderType = {
      key: maxKey.toString(),
      folder: folderTitle || 'Не указано',
      dopTitle: folderDescription || 'Не указано',
      count: 0,
      country: 'Не указано',
      latestActivity: Date.now().toString(),
      proxies: []
    }

    if (proxyData) {
      const newProxyData = [...proxyData, newProxyFolder]
      dispatch(setUserProxyFolders(newProxyData))
    } else {
      const newProxyData = [newProxyFolder]
      dispatch(setUserProxyFolders(newProxyData))
    }
    resetAllData()
    onCancel()
  }
  
  return (
    <Modal
      title="Новая папка для proxy"
      open={open}
      onOk={() => handleNewProxyFolder()}
      onCancel={() => {resetAllData(); onCancel()}}
      okButtonProps={{ title: 'Добавить' }}
      cancelButtonProps={{ title: 'Отмена' }}
      okText='Добавить'
      cancelText='Отмена'
    >
    <div className={`w-[100%] my-8 flex items-center gap-4 ${className}`}>
      <div className="object-contain h-[130px]">
        <img className='h-full' src={proxyCard} alt='table card'/>
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
      </div>
    </div>
    </Modal>
  )
}

import { AuditOutlined, ClusterOutlined, GlobalOutlined, HistoryOutlined, KeyOutlined, LinkOutlined } from '@ant-design/icons'
import { Input, Modal } from 'antd'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StoreState } from '../../../store/store'
import { IProxyHeaderType } from './Collumns'
import { IProxyData } from './ParseAccountsTable'
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

export const ModalAddNewProxy = ({open, onOk, onCancel, className}: IModalAddNewProxy) => {
  const dispatch = useDispatch()
  const selectedFolder = useSelector((state: StoreState) => state.app.proxyManagerFolder)
  const proxyFolderAllData: IProxyHeaderType[] | null = useSelector((state: StoreState) => state.user.userProxyFolders)
  const proxyFolderData: IProxyHeaderType | null = proxyFolderAllData?.find((folder: IProxyHeaderType) => folder.key === selectedFolder) || null

  const [ipInput, setIpInput] = useState<string | null>(null)
  const [portInput, setPortInput] = useState<string | null>(null)
  const [loginInput, setLogintInput] = useState<string | null>(null)
  const [mtproxyInput, setMtProxyInput] = useState<string | null>(null)
  const [passInput, setPassInput] = useState<string | null>(null)
  const [delayInput, setDelayInput] = useState<string | null>(null)
  const [secretInput, setSecretInput] = useState<string | null>(null)

  const [ipInputStatus, setIpInputStatus] = useState<IInputStatus>({status: "", msg: ""})
  const [portInputState, setPortInputState] = useState<IInputStatus>({status: "", msg: ""})
  const [loginInputState, setLoginInputState] = useState<IInputStatus>({status: "", msg: ""})
  const [mtproxyInputState, setMtproxyInputState] = useState<IInputStatus>({status: "", msg: ""})
  const [passInputState, setPassInputState] = useState<IInputStatus>({status: "", msg: ""})
  const [delayInputState, setDelayInputState] = useState<IInputStatus>({status: "", msg: ""})
  const [secretInputState,setSecretInputState] = useState<IInputStatus>({status: "", msg: ""})

  const resetAllData = () => {
    setIpInput(null)
    setPortInput(null)
    setLogintInput(null)
    setMtProxyInput(null)
    setPassInput(null)
    setDelayInput(null)
    setSecretInput(null)
  }

  const handleNewProxy = () => {
    const inputProps = [ipInput, portInput, loginInput, mtproxyInput, passInput, delayInput, secretInput]
    const inputStatus = [setIpInputStatus, setPortInputState, setLoginInputState, setMtproxyInputState, setPassInputState, setDelayInputState, setSecretInputState]
    inputProps.forEach((input, index) => {
      if (!input) {
        inputStatus[index]({status: "error", msg: `${inputStatus[index]}`})
        return
      }
    })

    if (proxyFolderData && proxyFolderAllData) {
      let maxKey = Math.max(...proxyFolderData?.proxies?.map((proxy: IProxyData) => Number(proxy.key))) + 1
      if (maxKey === -Infinity) { maxKey = 0 }

      const newProxy: IProxyData = {
        key: maxKey.toString(),
        ip: ipInput || '',
        port: portInput || '',
        secret: secretInput || '',
        MTProxy: mtproxyInput || '',
        timeout: delayInput || '',
        userName: '',
        pass: passInput || '',
      }

      const newProxyPush = [...proxyFolderData.proxies, newProxy]
      const newProxyFolderData = {...proxyFolderData, proxies: newProxyPush}
      const newProxyArray = proxyFolderAllData.map((folder) => {
        if (folder.key !== selectedFolder) {
          return folder
        }
      })

      const newFoldersDataAll = [...newProxyArray, newProxyFolderData].sort((a: IProxyHeaderType | undefined, b: IProxyHeaderType | undefined) => Number(a?.key) - Number(b?.key)).filter((folder) => folder !== undefined)
      dispatch(setUserProxyFolders(newFoldersDataAll as IProxyHeaderType[]))
      resetAllData()
      onCancel()
    } else {
      console.error('an error was occured while tring push new proxy data')
      resetAllData()
      onCancel()
    }
  }

  return (
    <Modal
      title="Новый proxy"
      open={open}
      onOk={() => handleNewProxy()}
      onCancel={() => {resetAllData(); onCancel()}}
      okButtonProps={{ title: 'Добавить' }}
      cancelButtonProps={{ title: 'Отмена' }}
      okText='Добавить'
      cancelText='Отмена'
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          {/* <Title style={{ margin: '0 5px' }} level={5}>IP</Title> */}
          <Input 
            prefix={<ClusterOutlined style={{ marginRight: 5 }}/>}
            size='large'
            placeholder='IP'
            value={ipInput || ""}
            status={ipInputStatus.status}
            onChange={(e) => {setIpInputStatus({status: "", msg: ""}); setIpInput(e.currentTarget.value)}}
          />
        </div>

        <div className="flex flex-col gap-1">
          {/* <Title style={{ margin: '0 5px' }} level={5}>Порт</Title> */}
          <Input 
            prefix={<LinkOutlined style={{ marginRight: 5 }}/>}
            size='large'
            placeholder='Порт'
            value={portInput || ""}
            status={portInputState.status}
            onChange={(e) => {setPortInputState({status: "", msg: ""}); setPortInput(e.currentTarget.value)}}
          />
        </div>

        <div className="flex flex-col gap-1">
          {/* <Title style={{ margin: '0 5px' }} level={5}>Логин</Title> */}
          <Input 
            prefix={<AuditOutlined style={{ marginRight: 5 }}/>}
            size='large'
            placeholder='Логин'
            value={loginInput || ""}
            status={loginInputState.status}
            onChange={(e) => {setLoginInputState({status: "", msg: ""}); setLogintInput(e.currentTarget.value)}}
          />
        </div>

        <div className="flex flex-col gap-1">
          {/* <Title style={{ margin: '0 5px' }} level={5}>Пароль</Title> */}
          <Input 
            prefix={<KeyOutlined style={{ marginRight: 5 }}/>}
            size='large'
            placeholder='Пароль'
            value={passInput || ""}
            status={passInputState.status}
            onChange={(e) => {setPassInputState({status: "", msg: ""}); setPassInput(e.currentTarget.value)}}
          />
        </div>

        <div className="flex flex-col gap-1">
          {/* <Title style={{ margin: '0 5px' }} level={5}>Тип</Title> */}
          <Input 
            prefix={<GlobalOutlined />}
            size='large'
            placeholder='MT Proxy'
            value={mtproxyInput || ""}
            status={mtproxyInputState.status}
            onChange={(e) => {setMtproxyInputState({status: "", msg: ""}); setMtProxyInput(e.currentTarget.value)}}
          />
        </div>

        <div className="flex flex-col gap-1">
          {/* <Title style={{ margin: '0 5px' }} level={5}>Задержка</Title> */}
          <Input 
            prefix={<HistoryOutlined style={{ marginRight: 5 }}/>}
            size='large'
            placeholder='Задержка'
            value={delayInput || ""}
            status={delayInputState.status}
            onChange={(e) => {setDelayInputState({status: "", msg: ""}); setDelayInput(e.currentTarget.value)}}
          />
        </div>
        <div className="flex flex-col gap-1">
          {/* <Title style={{ margin: '0 5px' }} level={5}>Задержка</Title> */}
          <Input 
            prefix={<HistoryOutlined style={{ marginRight: 5 }}/>}
            size='large'
            placeholder='Секрет'
            value={secretInput || ""}
            status={secretInputState.status}
            onChange={(e) => {setDelayInputState({status: "", msg: ""}); setSecretInput(e.currentTarget.value)}}
          />
        </div>
      </div>
    </Modal>
  )
}

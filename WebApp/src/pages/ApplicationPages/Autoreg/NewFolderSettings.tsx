import { Button, Cascader, InputNumber, Statistic, Popover, Typography, Select, ConfigProvider, Spin } from 'antd'
import { FolserSelection } from './FolserSelection'
import { CheckOutlined, InfoCircleOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { colors } from '../../../global-style/style-colors.module'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'
import { smsServicesTypes, smsServiciesDataType } from '../../../store/types'
import { useEffect, useState } from 'react'
import { DefaultOptionType } from 'antd/es/select'
import type { SelectProps } from 'antd';
import { NoDataCountries, ServiceIsNotSelected } from '../../../components/CustomNoData/NoDataCountries'
import axios from 'axios'
import { IProxyHeaderType } from '../ProxyManager/Collumns'
import { notification } from 'antd'
import { useDispatch } from 'react-redux'
import { setUserManagerFolders } from '../../../store/userSlice'

const { Title } = Typography

type propsType = {
  current: number | string,
  value: number | string,
}

interface IProxyClearData {
  value: string,
  label: string,
  children: {value: string | number, label: string}[]
}

type errType = "" | "warning" | "error" | undefined

const getAvaliablePhones = async (service: string | null, countryId: string | null): Promise<any> => {
  if (!service && !countryId) return null

  try {
    const avaliablePhones = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/telegram/get-available-phones?service=${service}&countryId=${countryId}`)
    return avaliablePhones
  } catch (err) {
    console.error(err)
    return null
  }
}


export const NewFolderSettings = ({current, value}: propsType) => {
  const dispatch = useDispatch()
  // UserData
  const userMail = useSelector((state: StoreState) => state.user.mail)
  // Accounts folders
  const accountsFolders = useSelector((state: StoreState) => state.user.userManagerFolders)

  // SMS servicies
  const smsServicies = useSelector((state: StoreState) => state.app.smsServiciesData)
  const smsServiciesData = smsServicies?.filter((service: smsServiciesDataType) => service.countries?.length)

  // Proxies
  const proxiesRawData = useSelector((state: StoreState) => state.user.userProxyFolders)
  const [proxyClearData, setProxyClearData] = useState<IProxyClearData[] | null>(null)

  const [avaliablePhonesLoading, setAvaliablePhonesLoading] = useState<boolean>(false)

  const [smsServisies, setSmsServisies] = useState<DefaultOptionType[] | null>(null)
  const [avaliableCountries, setAvaliableCountries] = useState<SelectProps[]>([])
  const [avaliablePhones, setAvaliablePhones] = useState<{cost: number, count: number} | null>(null) // Avaliable phones data

  // Input selection
  const [selectedSmsService, setSelectedSmsService] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<{label: string, value: string} | null>(null)
  const [selectedProxy, setSelectedProxy] = useState<(string | number)[] | null>(null)
  const [accountsCount, setAccountsCount] = useState<number | null>(null)

  const [smsServiseErr, setSmsServiseErr] = useState<errType>("")
  const [countryErr, setCountryErr] = useState<errType>("")
  const [proxyErr, setProxyErr] = useState<errType>("")
  const [countErr, setCountErr] = useState<errType>("")

  // Folder 
  const [folderTitle, setFolderTitle] = useState<{label: string, value: errType} | null>(null)
  const [folderDescription, setFolderDescription] = useState<{label: string, value: errType} | null>(null)
  const [apiHashInput, setApiHashInput] = useState<{label: string, value: errType} | null>(null)
  const [apiIdInput, setApiIdInput] = useState<{label: number, value: errType} | null>(null)

  // Main Button
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)

  const upDateFields = (): void => {
    setSelectedCountry(null)
    setAvaliableCountries([])
    setAvaliablePhones(null)
  }

  const resetFields = () => {
    setSelectedSmsService(null)
    setSelectedCountry(null)
    setAvaliableCountries([])
    setAvaliablePhones(null)
    setSelectedProxy(null)
    setFolderTitle(null)
    setFolderDescription(null)
    setApiHashInput(null)
    setApiIdInput(null)
    setAccountsCount(null)
  }

  const pushAccountsToDb = async () => {
    // Chek if folder fields not filled
    if (!folderTitle) {
      setFolderTitle({label: "", value: "error"})
      return
    }
    if (!folderDescription) {
      setFolderDescription({label: "", value: "error"})
      return
    }
    if (!apiHashInput) {
      setApiHashInput({label: "", value: "error"})
      return
    }
    if (!apiIdInput) {
      setApiIdInput({label: 0, value: "error"})
      return
    }
    
    // Chek if input fields not filled
    const inputProps = [selectedSmsService, selectedCountry, selectedProxy, accountsCount]
    const inputErrStatus = [setSmsServiseErr, setCountryErr, setProxyErr, setCountErr]
    inputProps.forEach((input, index) => {
      if (!input) {
        inputErrStatus[index]("error")
        return
      }
    })
    if (!accountsCount) {
      setCountErr("error")
      return
    }
    if (accountsCount <= 0) {
      setCountErr("error")
      return
    }

    // set button loading
    setButtonLoading(true)

    // Get accounts folders from DB
    const accountsFoldersFromBD = async (mail: string): Promise<void> => {
      try {
        if (mail) {
          const accounts: any = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/newAccountsFolder/get-accounts-folders/${mail}`)
          if (accounts.status === 200) {
            dispatch(setUserManagerFolders(accounts.data))
          } else {
            console.error('Error occured while trying handle accounts folders')
          }
        }
      } catch(err: any) {
        console.error(err)
        setButtonLoading(false)
      }
    }
    
    // Adding new folder to DB
    const addNewFolder = async () =>  {
      try {
        const url = `${process.env.REACT_APP_SERVER_END_POINT}/newAccountsFolder/add-new-folder`
        // Lates folder key
        let maxFolderKey: string
        if (accountsFolders) {
          const maxKey = Math.max(...accountsFolders?.map((folder) => Number(folder.key))) + 1
          if (maxKey === -Infinity) {
            maxFolderKey = "0"
          } else {
            maxFolderKey = maxKey.toString()
          }
        } else {
          maxFolderKey = '0'
        }
  
        const newFolder = {
          key: maxFolderKey,
          apiId: apiIdInput.label,
          apiHash: apiHashInput.label,
          folder: folderTitle.label,
          dopTitle: folderDescription.label,
          accountsAmount: 0,
          country: selectedCountry?.label,
          latestActivity: new Date(),
          banned: 0,
          accounts: []
        }
        console.log(newFolder)
        const res = await axios.post(url, {mail: userMail, folder: newFolder})
          .then((res) => {
            return 200
          })
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
        // Setting up new folders
        if (userMail) {
          await accountsFoldersFromBD(userMail)
          if (res === 200) return newFolder
        }
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
        setButtonLoading(false)
        return null
      }
    }

    const registerAccounts = async () => {
      const newAddedFolder = await addNewFolder()
      if (newAddedFolder) {
        console.log(newAddedFolder)
        try {
          const tgaAutoregUrl = `${process.env.REACT_APP_SERVER_END_POINT}/telegram/auto/register-user`
    
          const request = {
            telegramUser: {
              service: selectedSmsService,
              contryId: selectedCountry?.value,
              language: "ru"
            },
            user: {
              email: userMail,
              tgFolderKey: newAddedFolder.key,
              apiId: "me",
              apiHash: "me"
            }
          }
    
          const res = await axios.post(tgaAutoregUrl, request)
          if (res) {
            notification['success']({
              message: 'Акаунты успешно зарегестрированы',
              description: 'Акаунты были успешно зарегестрированы и добавлены в папку с акаунтами',
              placement: 'bottomRight'
            })
          }
          console.log({res})
        } catch(err: any) {
          console.error(err)
          notification['error']({
            message: 'Ошибка при регистрации аккаунтов',
            description: 'Измените параметры создания аккаунтов или попробуйте позже. Возможно ошибка сервера',
            placement: 'bottomRight'
          })
          setButtonLoading(false)
        }
      }
    }
    await registerAccounts()
    // Setting up new folders
    if (userMail) {
      await accountsFoldersFromBD(userMail)
    }
    setButtonLoading(false)
  }

  // Set proxy clear data
  useEffect(() => {
    const proxies = proxiesRawData?.map((proxy: IProxyHeaderType) => {
      const proxyTableData = proxy.proxies.map((proxyData) => {
        return (
          {
            value: proxyData.key,
            label: proxyData.userName
          }
        )
      })
      return (
        {
          value: proxy.folder, 
          label: proxy.folder,
          children: [
            ...proxyTableData
          ]
        }
      )
    })
    setProxyClearData(proxies || null)
  }, [proxiesRawData])
  
  // Paste clear data to sms servicies
  useEffect(() => {
    const smsServisies = smsServiciesData?.map((el: smsServicesTypes) => ({value: el.title, label: el.title})) || null
    setSmsServisies(smsServisies)
  }, [smsServicies])

  // Parce avaliable countries
  useEffect(() => {
    const selectCountriesList = smsServiciesData?.find((service) => service.title === selectedSmsService)
    if (selectCountriesList && selectCountriesList?.countries !== 'loading') {
      const countiesDebounceSelect = selectCountriesList?.countries?.map((country) => {
        return { label: country.name, value: country.id }
      })
      setAvaliableCountries(countiesDebounceSelect || [])
    }
  }, [selectedSmsService])

  // Parse avaliable phones
  useEffect(() => {
    setAvaliablePhonesLoading(true)
    if (selectedCountry?.label && selectedCountry?.value) {
      getAvaliablePhones(selectedSmsService, selectedCountry?.value)
        .then((data) => {
          if (data) {
            setAvaliablePhones(data.data.telegram)
          } else {
            setAvaliablePhones({cost: 0, count: 0}) // null
          }
        })
    }
    setAvaliablePhonesLoading(false)
  }, [selectedCountry])

  return (
    <motion.div 
      className='min-w-full flex flex-col justify-between'
      initial={value === current ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      animate={value === current ? { opacity: 1, scale: 1 } : 'null'}
      transition={{ duration: 0.2 }}
    >
      <div>
      <FolserSelection 
        className='mb-5' 
        folderTitle={folderTitle}
        folderDescription={folderDescription}
        apiHashInput={apiHashInput}
        apiIdInput={apiIdInput}
        setFolderTitle={setFolderTitle}
        setFolderDescription={setFolderDescription}
        setApiHashInput={setApiHashInput}
        setApiIdInput={setApiIdInput}
      />

      <div className="w-full flex gap-3 mb-5">
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Выбор смс сервиса</Title>
            <Popover className='cursor-pointer' title="Смс сервис" content='Тут может быть описание смс сервисов'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <Select 
            placeholder="Смс сервис" 
            size='large' 
            className='w-full'
            options={smsServisies ? smsServisies : []}
            dropdownMatchSelectWidth={false}
            allowClear
            value={selectedSmsService}
            status={smsServiseErr}
            onClear={() => {
              upDateFields()
              setAvaliableCountries([])
              setSelectedSmsService(null)
            }}
            onSelect={(service) => {
              upDateFields()
              setSelectedSmsService(service)
              setSmsServiseErr("")
              setAccountsCount(null)
            }}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Выбор страны</Title>
            <Popover className='cursor-pointer' title="Страна" content='Тут может быть описание выбора стран'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <ConfigProvider renderEmpty={avaliableCountries.length ? NoDataCountries : ServiceIsNotSelected}>
            <Select
              size='large'
              showSearch
              placeholder='Страна'
              optionFilterProp="children"
              status={countryErr}
              filterOption={(input, option) => ((option as {label: string, value: string})?.label.toLowerCase() ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                ((optionA as {label: string, value: string})?.label ?? '').toLowerCase().localeCompare(((optionB as {label: string, value: string})?.label ?? '').toLowerCase())
              }
              // mode="tags"
              value={selectedCountry?.label}
              style={{ width: '100%' }}
              onChange={(_, countryData) => {
                setSelectedCountry(countryData as {label: string, value: string});
                setCountryErr("")
                setAccountsCount(null)
              }}
              tokenSeparators={[',']}
              options={avaliableCountries || []}
            />
          </ConfigProvider>
        </div>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Proxy</Title>
            <Popover className='cursor-pointer' title="Proxy" content='Тут может быть описание proxy'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <Cascader 
            placeholder="Proxy" 
            size='large' 
            className='w-full'
            status={proxyErr}
            options={proxyClearData || []}
            value={selectedProxy || undefined}
            onChange={(e) => {
              setSelectedProxy(e)
              setProxyErr("")
            }}
          />
        </div>
        <div className="w-full flex gap-3 mb-7">
          <div className="w-full flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <Title level={5} style={{ margin: '0 0' }}>Кол-во аккаунтов</Title>
              <Popover className='cursor-pointer' title="Кол-во аккаунтов" content='Тут может быть описание кол-ва аккаунтов'>
                <InfoCircleOutlined />
              </Popover>
            </div>
            <InputNumber 
              size='large' 
              defaultValue={0} 
              min={0} 
              status={countErr}
              max={avaliablePhones?.count !== undefined ? avaliablePhones?.count : 0} 
              addonBefore={<UserOutlined />} 
              className='w-full' 
              value={Number(accountsCount) || 0}
              onChange={(e) => {
                setAccountsCount(e)
                setCountErr("")
              }}
            />
          </div>
          {avaliablePhonesLoading ? (
            <Statistic 
              valueStyle={{ color: colors.primary }} 
              className='w-full' 
              title="Доступно номеров" 
              value={' '}
              prefix={ <div><UserSwitchOutlined /> <Spin/> </div>} 
            />
          ) : (
            <Statistic 
              valueStyle={{ color: colors.primary }} 
              className='w-full' 
              title="Доступно номеров" 
              value={avaliablePhones?.count !== undefined ? avaliablePhones?.count : '-'} 
              prefix={ <UserSwitchOutlined />} 
            />
          )}
        </div>
      </div>
      </div>

      <div className="w-full flex justify-between items-center">
        {selectedSmsService || selectedCountry || selectedProxy || folderTitle || folderDescription ? (
          <Button danger type='link' onClick={() => resetFields()}>Отменить</Button>
        ) : (
          <div></div>
        )}
        <Button 
          loading={buttonLoading}
          icon={<CheckOutlined />} 
          size='large' 
          type='primary'
          onClick={() => pushAccountsToDb()}
        >
          Зарегестрировать аккаунты
        </Button>
      </div>
    </motion.div>
  )
}

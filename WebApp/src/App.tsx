import React, { useEffect, useRef } from 'react'
import { Registration } from './pages/Registration';
import { Logining } from './pages/Logining';
import { Application } from './pages/Application';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { IRootStoreState, smsServiciesDataType } from './store/types';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { 
  setUserMail, 
  setUserIsLogined, 
  setUserId, 
  setUserNick, 
  setUserManagerFolders,
  setUserProxyFolders,
  setUserDefaulAppHash,
  setUserDefaulAppId,
  setUserToken,
} from './store/userSlice'
import { setSmsServiciesData, setSmsServisies } from './store/appSlice';
import { 
  generateRandomNumber, 
  generateRandomStatus, 
  generateRandomString 
} from './utils/generateTempData';
import axios from 'axios'
import { IProxyData } from './pages/ApplicationPages/ProxyManager/ParseAccountsTable';
import { IProxyHeaderType } from './pages/ApplicationPages/ProxyManager/Collumns';
import "quill/dist/quill.snow.css"


export interface ILocalStorageParced {
  id: string,
  token: string,
  mail: string,
  nick: string,
  defaultAppHash: string,
  defaultAppId: string,
  latestUpdate: number
}

const MAX_SESSION_DURATION = 10 * 60 * 60 * 1000   // 10 hours in milliseconds

const App: React.FC = () => {
  const dispatch = useDispatch()
  const isUserLogined = useSelector((state: IRootStoreState) => state.user.isUserLogined)

  const navigate = useNavigate()

  const setSmsServiciesFromDB = async (): Promise<void> => {
    try {
      const servicies = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/telegram/get-service`)
      const smsServiciesArray: smsServiciesDataType[] = servicies.data.map((service: string) => (
        {
          title: service,
          balance: 'loading',
          countries: 'loading',
          cost: 'loading',
          count: 'loading',
        }
      ))
      dispatch(setSmsServisies(smsServiciesArray))
      dispatch(setSmsServiciesData(smsServiciesArray))

      if (servicies.data) {
        const smsServiciesData = await Promise.all(
          servicies.data.map(async (service: string) => {
            try {
              const countries = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/telegram/get-country?service=${service}`)
              const priceAndPhones = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/telegram/get-available-phones?service=${service}&countryId=${countries.data[0].id}`) || null
              const balance = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/telegram/get-balance?service=${service}`)
              return { title: service, balance: balance.data, countries: countries.data, cost: priceAndPhones.data.telegram.cost, count: priceAndPhones.data.telegram.count }
            } catch(err) {
              return { title: service, balance: null, countries: null, cost: null, count: null }
            }
          })
        )
        dispatch(setSmsServiciesData(smsServiciesData))
      }

    } catch (error) {
      console.error(error)
    }
  }

  // Set accounts folders from BD
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
    }
  }


  // Dummy proxy data (temp)
  const ParseProxiesTable = () => {
    const accountsData = useRef<IProxyData[]>()
  
    useEffect(() => {
      const dummyAll = new Array(35).fill(0).map((_, index) => { return {
        key: index.toString(),
        ip: generateRandomString(14),
        port: generateRandomNumber(4),
        secret: generateRandomString(14),
        userName: `country-ms-session ${index}`,
        MTProxy: generateRandomString(14),
        pass: generateRandomString(10),
        timeout: generateRandomNumber(2),
        status: generateRandomStatus()
      }})
      accountsData.current = [...dummyAll]
    }, [])
  
    return accountsData.current
  }
  const ProxiesManagerTableData: IProxyHeaderType[] = [
    {
      key: '1',
      folder: 'Proxy 1',
      dopTitle: 'Аккаунты для прогрева',
      count: 12,
      country: 'Финляндия',
      latestActivity: '22 апреля, 2023',
      proxies: [...ParseProxiesTable() || []]
    },
    {
      key: '2',
      folder: 'Proxy 2',
      dopTitle: 'Аккаунты для каналов',
      count: 24,
      country: 'Германия',
      latestActivity: '22 апреля, 2023',
      proxies: [...ParseProxiesTable() || []]
    },
    {
      key: '3',
      folder: 'Proxy 3',
      dopTitle: 'Аккаунты для переписок',
      count: 24,
      country: 'Тайланд',
      latestActivity: '22 апреля, 2023',
      proxies: [...ParseProxiesTable() || []]
    },
    {
      key: '4',
      folder: 'Proxy 4',
      dopTitle: 'Аккаунты для переписок',
      count: 24,
      country: 'Тайланд',
      latestActivity: '22 апреля, 2023',
      proxies: [...ParseProxiesTable() || []]
    },
  ]
  

  /**
   * Chek if user logedin and stay user logedin after page reload
   * by saved data in localStorage
   */
  useEffect(() => {
    const token = localStorage.getItem('sessionToken')  // contains user email
    if (token) {
      // Parce data from localStorage
      const tokenData: ILocalStorageParced = JSON.parse(token)
      // Check if local storage was created no later than 10 hours ago
      if (tokenData.latestUpdate + MAX_SESSION_DURATION > Number(new Date())) {
        dispatch(setUserMail(tokenData.mail))
        dispatch(setUserId(Number(tokenData.id)))
        dispatch(setUserToken(tokenData.token))
        dispatch(setUserNick(tokenData.nick))
        dispatch(setUserIsLogined(true))
        
        accountsFoldersFromBD(tokenData.mail)
        dispatch(setUserProxyFolders(ProxiesManagerTableData))
  
        // App hash / ID
        dispatch(setUserDefaulAppHash(tokenData.defaultAppHash))
        dispatch(setUserDefaulAppId(Number(tokenData.defaultAppId)))
        
        setSmsServiciesFromDB() // get and set sms service from DB
        
        navigate("/app")
      } else {
        navigate("/")
      }
    } else {
      navigate("/")
    }
  }, [isUserLogined])
  
  return (
    <Routes>
      <Route path="/registration" element={<Registration />}/>
      <Route path="/" element={<Logining />}/>
      <Route path="/app/*" element={<Application />}/>
    </Routes>
  )
}

export default App;



import { useState, useEffect } from 'react'
import { contentStyle } from '../../../global-style/layoutStyle'
import { HeaderComponent } from '../../../components/HeaderComponent/HeaderComponent'
import { ConfigProvider, Layout  } from 'antd'
import { Folders } from './Folders'
import { AccountsTable } from './AccountsTable'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'
import { NoAccounts } from '../../../components/CustomNoData/NoAccounts'


const { Content } = Layout

export const AccountsManagerPage = ({ style }: { style?: React.CSSProperties }) => {
  const [openFolder, setOpenFolder] = useState<React.Key | null>(null)
  const currentFolder = useSelector((state: StoreState) => state.app.accountsManagerFolder)

  useEffect(() => {
    setOpenFolder(currentFolder)
    // console.log(currentFolder)
  }, [currentFolder])

  return (
      <Layout style={{...contentStyle, ...style}}>
        <HeaderComponent title='Менеджер аккаунтов'/>

        <Content className='flex flex-col gap-10'>
          <ConfigProvider renderEmpty={NoAccounts}>
            {openFolder ? (
              <AccountsTable />
              ) : (
              <Folders />
            )}
          </ConfigProvider>
        </Content>
      </Layout>
  )
}

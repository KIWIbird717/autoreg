import { ConfigProvider, Table } from 'antd';
import { useEffect, useState } from 'react';
import { NoParseFolders } from '../../../../components/CustomNoData/NoParseFolders'
import { TableHeaders } from './TableHeaders'
import { useSelector } from 'react-redux'
import type { StoreState } from '../../../../store/store'

export const DistributionFolders = () => {
  const distributionFolders = useSelector((state: StoreState) => state.app.distributionFolders);

  const [currentFolders, setCurrentFolders] = useState(distributionFolders)

  // set current distribution folders
  useEffect(() => {
    console.log(distributionFolders)
    setCurrentFolders(distributionFolders)
  }, [distributionFolders])

  return (
    <div>
      <ConfigProvider renderEmpty={NoParseFolders}>
        <Table 
          style={{ margin: '0 0' }}
          columns={TableHeaders()}
          dataSource={currentFolders || []}
          pagination={{ pageSize: 6 }}
          loading={currentFolders === null ? true : false}
        />
      </ConfigProvider>
    </div>
  )
}

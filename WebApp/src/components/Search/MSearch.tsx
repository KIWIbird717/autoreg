import React from 'react'
import { Input } from 'antd'
import { SearchProps } from 'antd/es/input'
import { colors } from '../../global-style/style-colors.module'
import { SearchOutlined } from '@ant-design/icons'
import styles from './styles.module.css'

const { Search } = Input

export const MSearch = (props: SearchProps) => {
  const bgColor = colors.dopFont2
  return (
    <Search 
      {...props}
      bordered={false}
      rootClassName={styles.select_button}
      className='w-[300px] rounded-xl'
      style={{ color: colors.dopFont, backgroundColor: bgColor }}
      prefix={<SearchOutlined className='mr-1' style={{ color: colors.font }}/>}
    />
  )
}

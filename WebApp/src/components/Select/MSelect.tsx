import { Select, SelectProps } from 'antd'
import { colors } from '../../global-style/style-colors.module'


export const MSelect = (props: SelectProps) => {
  const bgColor = colors.dopFont2
  return (
    <Select 
      {...props}
      bordered={false}
      className='rounded-xl'
      style={{ ...props.style, color: colors.dopFont, backgroundColor: bgColor }}
    />
  )
}

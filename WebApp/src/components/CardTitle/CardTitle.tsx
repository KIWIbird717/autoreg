import { Typography } from "antd"
import { colors } from "../../global-style/style-colors.module"

const { Title } = Typography

interface IProps {
  title: string
  dopTitle?: string
}

export const CardTitle = ({ title, dopTitle }: IProps) => {
  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col">
        <div className="flex gap-2">
          <Title level={3} style={{ margin: '0 0', fontWeight: 'bold' }} className="font-['Inter']">{title}</Title>
        </div>
        <Title level={5} style={{ margin: '0 0', fontWeight: 'normal', color: colors.dopFont }}>{dopTitle}</Title>
      </div>
    </div>
  )
}

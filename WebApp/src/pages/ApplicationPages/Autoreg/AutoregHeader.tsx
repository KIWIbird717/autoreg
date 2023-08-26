import { Typography } from "antd"
import { colors } from "../../../global-style/style-colors.module"
import { ReactNode } from "react"

const { Title } = Typography

type propsType = {
  title: string,
  dopTitle: string,
  icon?: ReactNode
}

export const AutoregHeader = ({title, dopTitle, icon}: propsType) => {
  return (
    <div className="flex w-full justify-between mb-7">
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          {icon}
          <Title level={3} style={{ margin: '0 0', fontWeight: 'bold' }} className="font-['Inter']">{title}</Title>
        </div>
        <Title level={5} style={{ margin: '0 0', fontWeight: 'normal', color: colors.dopFont }}>{dopTitle}</Title>
      </div>
    </div>
  )
}

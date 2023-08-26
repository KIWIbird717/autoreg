import { InfoCircleOutlined } from "@ant-design/icons";
import { Row, Col, Typography, Popover } from "antd";
import { ReactNode } from "react";

const { Title } = Typography


interface IProps {
  popoverTitle1: string
  popoverDesription1: string
  popoverTitle2?: string
  popoverDesription2?: string
  item1: ReactNode
  item2?: ReactNode
}

export const MInput = ({ popoverTitle1, popoverDesription1, popoverTitle2, popoverDesription2, item1, item2 }: IProps) => {
  return (
    <Row gutter={20} align={'bottom'} style={{ width: '100%' }}>
      <Col span={12}>
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center ml-1">
            <Title level={5} style={{ margin: '0 0' }}>{popoverTitle1}</Title>
            <Popover className='cursor-pointer' title={popoverTitle1} content={popoverDesription1}>
              <InfoCircleOutlined />
            </Popover>
          </div>
            {item1}
        </div>
      </Col>
      {item2 && <Col span={12}>
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center ml-1">
            <Title level={5} style={{ margin: '0 0' }}>{popoverTitle2}</Title>
            <Popover className='cursor-pointer' title={popoverTitle2} content={popoverDesription2}>
              <InfoCircleOutlined />
            </Popover>
          </div>
            {item2}
        </div>
      </Col>}
    </Row>
  )
}

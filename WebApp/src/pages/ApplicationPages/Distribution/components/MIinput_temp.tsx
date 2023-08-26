import { Row, Col, Typography, Popover } from "antd";
import { ReactNode } from "react";

const { Title } = Typography;
interface IProps {
  popoverTitle1?: string;
  popoverDesription3?: string;
  popoverTitle3?: string;
  item1?: ReactNode;
  item2?: ReactNode;
  item3?: ReactNode;
}
export const MIinput_temp = ({
  popoverTitle1,
  popoverTitle3,
  popoverDesription3,
  item1,
  item2,
  item3,
}: IProps) => {
  return (
    <Row gutter={20} align={"bottom"} style={{ width: "100%" }}>
      <Col span={24}>
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center ml-1">
            <Title level={5} style={{ margin: "0 0" }}>
              {popoverTitle1}
            </Title>
          </div>
          {item1}
        </div>
      </Col>
      {item2 && (
        <Col span={12}>
          <div className="w-full flex flex-col gap-1">{item2}</div>
        </Col>
      )}
      {item3 && (
        <Col span={12}>
          <div className="w-full flex flex-col gap-1">
            <div className="flex gap-2 items-center ml-1">
              <Title level={5} style={{ margin: "0 0" }}>
                {popoverTitle3}
              </Title>
              <Popover
                className="cursor-pointer"
                title={popoverTitle3}
                content={popoverDesription3}
              ></Popover>
            </div>
            {item3}
          </div>
        </Col>
      )}
    </Row>
  );
};

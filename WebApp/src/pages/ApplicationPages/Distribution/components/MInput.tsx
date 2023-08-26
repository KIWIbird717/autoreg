import { InfoCircleOutlined } from "@ant-design/icons";
import { Row, Col, Typography, Popover } from "antd";
import { ReactNode } from "react";

const { Title } = Typography;

interface IProps {
  popoverTitle1?: string;
  popoverDesription1?: string;
  popoverTitle2?: string;
  popoverDesription2?: string;
  popoverTitle3?: string;
  popoverDesription3?: string;
  popoverTitle4?: string;
  popoverDesription4?: string;
  item1?: ReactNode;
  item2?: ReactNode;
  item3?: ReactNode;
  item4?: ReactNode;
}

export const MInput = ({
  popoverTitle1,
  popoverDesription1,
  popoverTitle2,
  popoverTitle3,
  popoverDesription3,
  popoverTitle4,
  popoverDesription4,
  item1,
  item2,
  item3,
  item4,
}: IProps) => {
  return (
    <Row gutter={20} align={"bottom"} style={{ width: "100%" }}>
      <Col span={12}>
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center ml-1">
            <Title level={5} style={{ margin: "0 0" }}>
              {popoverTitle1}
            </Title>
            <Popover
              className="cursor-pointer"
              title={popoverTitle1}
              content={popoverDesription1}
            >
              <InfoCircleOutlined />
            </Popover>
          </div>
          {item1}
        </div>
      </Col>
      {item2 && (
        <Col span={12}>
          <div className="w-full flex flex-col gap-1">
            <div className="flex gap-2 items-center ml-1">
              <Title level={5} style={{ margin: "0 0" }}>
                {popoverTitle2}
              </Title>
            </div>
            {item2}
          </div>
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
              >
                <InfoCircleOutlined />
              </Popover>
            </div>
            {item3}
          </div>
        </Col>
      )}
      {item4 && (
        <Col span={12}>
          <div className="w-full flex flex-col gap-1">
            <div className="flex gap-2 items-center ml-1">
              <Title level={5} style={{ margin: "0 0" }}>
                {popoverTitle4}
              </Title>
              <Popover
                className="cursor-pointer"
                title={popoverTitle4}
                content={popoverDesription4}
              >
                <InfoCircleOutlined />
              </Popover>
            </div>
            {item4}
          </div>
        </Col>
      )}
    </Row>
  );
};

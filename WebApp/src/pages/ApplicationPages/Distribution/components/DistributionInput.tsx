import { Row, Col, Typography, Popover } from "antd";
import { ReactNode } from "react";

const { Title } = Typography;
interface IProps {
  popoverTitle1?: string;
  popoverDesription1?: string;
  popoverTitle2?: string;
  popoverDesription2?: string;
  item1?: ReactNode;
  item2?: ReactNode;
}
export const DistributionInput = ({
  popoverTitle1,
  popoverDesription1,
  popoverTitle2,
  item1,
  item2,
}: IProps) => {
  return (
    <Row gutter={20} align={"bottom"} style={{ width: "100%" }}>
      <Col span={12}>
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
    </Row>
  );
};

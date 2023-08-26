import { useEffect } from "react";
import { Col, Layout, Row } from "antd";
import { contentStyle } from "../../../global-style/layoutStyle";
import { HeaderComponent } from "../../../components/HeaderComponent/HeaderComponent";
import { Content } from "antd/es/layout/layout";
import { DistributionSetting } from "./DistrCard/DistributionSettingCard/DistributionSetting";
import { DistributionMessage } from "./DistrCard/MyDistributionMessenge/DistributionMessage";
import { TextEditor } from "./DistrCard/TextEditor/TextEditor";
import { parsingFoldersFromDB } from "../ParsingPage/ParseFolders/Folders";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { StoreState } from "../../../store/store";

export const DistributoionPage = ({
  style,
}: {
  style?: React.CSSProperties;
}) => {
  const dispatch = useDispatch();
  const userMail = useSelector((state: StoreState) => state.user.mail);

  useEffect(() => {
    if (!userMail) return;
    parsingFoldersFromDB(userMail, dispatch);
  }, []);

  return (
    <Layout style={{ ...contentStyle, ...style }}>
      <HeaderComponent title="Рассылка" />
      <Content className="flex flex-col gap-8 ">
        <Row gutter={20}>
          <Col span={12}>
            <DistributionSetting />
          </Col>
          <Col span={12}>
            <div>
              <DistributionMessage />
            </div>
            <div className="mt-5">
              <TextEditor />
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

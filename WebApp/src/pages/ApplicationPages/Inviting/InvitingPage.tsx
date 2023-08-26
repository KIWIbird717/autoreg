import { useEffect } from "react";
import { Col, Layout, Row } from "antd";
import { contentStyle } from "../../../global-style/layoutStyle";
import { HeaderComponent } from "../../../components/HeaderComponent/HeaderComponent";
import { Content } from "antd/es/layout/layout";
import { AdmingInviting } from "../Inviting/InvitingMethod/Admin/AdmingInviting";
import { UserInviting } from "../Inviting/InvitingMethod/User/UserInviting";
import { NoAccountdAD } from "../Inviting/NoAccountdAD";
import { parsingFoldersFromDB } from "../ParsingPage/ParseFolders/Folders";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { StoreState } from "../../../store/store";

export const InvitingPage = ({ style }: { style?: React.CSSProperties }) => {
  const dispatch = useDispatch();
  const userMail = useSelector((state: StoreState) => state.user.mail);

  useEffect(() => {
    if (!userMail) return;
    parsingFoldersFromDB(userMail, dispatch);
  }, []);

  return (
    <Layout style={{ ...contentStyle, ...style }}>
      <HeaderComponent title="Инвайтинг" />
      <Content className="flex flex-col gap-8">
        <NoAccountdAD />
        <Row gutter={20}>
          <Col span={12}>
            <AdmingInviting />
          </Col>
          <Col span={12}>
            <UserInviting />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

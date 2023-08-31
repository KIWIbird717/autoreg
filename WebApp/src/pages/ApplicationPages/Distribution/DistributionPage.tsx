import { useEffect } from "react";
import { Col, Layout, Row } from "antd";
import { contentStyle } from "../../../global-style/layoutStyle";
import { HeaderComponent } from "../../../components/HeaderComponent/HeaderComponent";
import { Content } from "antd/es/layout/layout";
import { DistributionSetting } from "./DistrCard/DistributionSettingCard/DistributionSetting";
import { DistributionMessage } from "./DistrCard/MyDistributionMessenge/DistributionMessage";
import { MessageEditor } from "./MessageEditor/MessageEditor";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { StoreState } from "../../../store/store";
import { MCard } from "../../../components/Card/MCard";
import { DistributionFolders } from "./DistributionFolders/DistributionFolders";
import { setDistributionFolders } from "../../../store/appSlice";
import axios from "axios";
import { setUserParsingFolders } from "../../../store/userSlice";

export const DistributoionPage = ({ style }: { style?: React.CSSProperties }) => {
  const dispatch = useDispatch();
  const userMail = useSelector((state: StoreState) => state.user.mail);

  // fetch distribution folders data
  useEffect(() => {
    try {
      const controller = new AbortController();
      const apiUrl = `${process.env.REACT_APP_SERVER_END_POINT}/moduleSender/get-distributions/${userMail}`
      axios.get(apiUrl, { signal: controller.signal })
        .then((res) => {
          if (res.status != 200) return;
          console.log(res)
          dispatch(setDistributionFolders(res.data))
        })
        .catch((err) => console.error(err))
  
      return () => {
        controller.abort()
      }
    } catch (err) {
      console.log(err)
    }
  }, [])

  // fetch parsed folders data
  useEffect(() => {
    try {
      const controller = new AbortController()
      const apiUrl = `${process.env.REACT_APP_SERVER_END_POINT}/parsingFolder/get-pasing-folders/${userMail}`
      axios.get(apiUrl, { signal: controller.signal })
        .then((res) => dispatch(setUserParsingFolders(res.data)))
        .catch((error) => console.error(error))
      return () => {
        controller.abort()
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

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
              <MessageEditor />
            </div>
          </Col>
        </Row>
        <MCard>
          <DistributionFolders />
        </MCard>
      </Content>
    </Layout>
  );
};

import Layout, { Content } from "antd/es/layout/layout"
import { HeaderComponent } from "../../../components/HeaderComponent/HeaderComponent"
import { contentStyle } from "../../../global-style/layoutStyle"
import { useState } from "react"
import { ParseChatParticipants } from "./ParceChatParticipants/ParseChatParticipants"
import { ParseFoldersManager } from "./ParseFolders/ParseFoldersManager"
import { Row, Col } from 'antd'
import { ParseFromComments } from "./ParseFromComments/ParseFromComments"
import { ParseByGeo } from "./ParseByGeo/ParseByGeo"
import { ParseByKeywords } from "./ParseByKeywords/ParseByKeywords"
import { ParseGroupsByKeyword } from "./ParseGroupsByKeywords/ParseGroupsByKeywords"


export const ParsingPage = ({ style }: { style?: React.CSSProperties }) => {
  const [accordionState, setAccordionState] = useState<string | boolean>(`panel${1}`)

  return (
    <Layout style={{...contentStyle, ...style}}>
      <HeaderComponent title='Парсинг'/>

      <Content>
        <div className="flex flex-col gap-3">
          <Row gutter={20}>
            <Col span={12} className="flex flex-col gap-3">
              <ParseChatParticipants id={1} expanded={accordionState} onChange={() => setAccordionState(`panel${1}`)}/>
              <ParseFromComments id={2} expanded={accordionState} onChange={() => setAccordionState(`panel${2}`)}/>
              <ParseByGeo id={3} expanded={accordionState} onChange={() => setAccordionState(`panel${3}`)}/>
              <ParseByKeywords id={4} expanded={accordionState} onChange={() => setAccordionState(`panel${4}`)}/>
              <ParseGroupsByKeyword id={5} expanded={accordionState} onChange={() => setAccordionState(`panel${5}`)}/>
            </Col>
            <Col span={12}>
              <div className="div">
                <ParseFoldersManager />
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  )
}

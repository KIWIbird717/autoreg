import { DownOutlined } from '@ant-design/icons'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { Typography } from "antd"
import { colors } from '../../../../global-style/style-colors.module'
import styles from './styles.module.css'
import globalCardStyles from '../../../../global-style/card.module.css'


const { Title } = Typography

interface IProps {
  title: string,
  dopTitle: string,
  id: number,
  expanded: string | boolean,
  onChange: (event: React.SyntheticEvent<Element, Event>, expanded: boolean) => void,
  children: React.ReactNode
}

export const AccordionStyled = ({title, dopTitle, id, expanded, onChange, children}: IProps) => {
  return (
    <Accordion
      style={{ borderRadius: 20 }}
      expanded={expanded === `panel${id}`}
      onChange={onChange}
      className={`${styles.accordion} ${globalCardStyles.global_card_shadow}`}
    >
      <AccordionSummary
        expandIcon={<DownOutlined />}
      >
        <div className="flex flex-col gap-1 m-2">
          <Title level={4} style={{ margin: '0 0', color: colors.font }}>{title}</Title>
          <Title level={5} style={{ margin: '0 0', fontWeight: 'normal', color: colors.dopFont }}>{dopTitle}</Title>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

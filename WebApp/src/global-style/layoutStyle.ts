import { BorderRight } from "@mui/icons-material"
import { colors } from "./style-colors.module"

/**
 * Here will be `React.CSSProperties` for `App.tsx` component layout
*/

// Local preferences
const headerStyleHeight: number = 64

// Styles
/**
 * `React.CSSProperties` for `<Sider />` component layout
*/
const siderStyle: React.CSSProperties = {
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: colors.white,
  padding: '0 20px',
  // borderRight: `1px solid ${colors.stroke}`,
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
}

/**
 * `React.CSSProperties` for `<Header />` component layout
*/
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#000',
  height: headerStyleHeight,
  paddingInline: 0,
  // lineHeight: '64px',
  backgroundColor: colors.background,
  display: 'flex',
  alignItems: "center",
  justifyContent: 'space-between',
  minHeight: '150px',
  // padding: '40px 0'
}

/**
 * `React.CSSProperties` for `<Content />` component layout
*/
const contentStyle: React.CSSProperties = {
  // minHeight: `calc(100vh - ${headerStyleHeight}px)`,
  marginLeft: '250px',
  minHeight: '100vh',
  lineHeight: '120px',
  color: '#000',
  backgroundColor: colors.background,
  padding: '0px 40px 40px 40px'
}

/**
 * `React.CSSProperties` for `<Card />` component layout
 */
const cardStyle: React.CSSProperties = {
  backgroundColor: colors.white,
  boxShadow: '0px 4px 80px rgba(57, 61, 85, 0.07), 0px 0.859547px 17.869px rgba(57, 61, 85, 0.0530829), 0px 0.153181px 5.32008px rgba(57, 61, 85, 0.0459551)'
}




export { siderStyle, headerStyle, contentStyle, cardStyle }

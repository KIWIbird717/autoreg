import ReactDOM from 'react-dom/client';
import './global-style/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd'
import { colors } from './global-style/style-colors.module';
import { Provider } from 'react-redux'
import store from './store/store';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = {
  token: {
    // Color paletee
    colorPrimary: colors.primary,
    colorAccent: colors.accent,
    // Font
    colorText: colors.font,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 23,
    fontSizeHeading5: 16,
    fontSizeLG: 16,
    fontWeightStrong: 600,
    lineHeightHeading1: 1.2105263157894737,
    lineHeightHeading2: 1.2666666666666666,
    lineHeightHeading3: 1.3333333333333333,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    marginXS: 8,
  }
}

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
);


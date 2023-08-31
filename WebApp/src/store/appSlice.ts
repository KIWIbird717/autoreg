import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { IAppState, IModuleSenderConfig } from "./types"

const initialState: IAppState = {
  appPage: '1',
  accountsManagerFolder: null,
  proxyManagerFolder: null,
  parseManagerFolder: null,
  userAvatar: null,
  smsServisies: null,
  smsServiciesData: null,
  logs: null,
  distributionFolders: null,
  selectedDistributionFolder: null,
  newDistributionMessages: {
    open: null,
    messages: []
  }
}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    /**
     * Need to set current Application page
     * Set pages in `SiderComponent`
     * 
     * @param '1' | '2' | '3' | '4' | '5' | '6'
     */
    setAppPage: (state, action: PayloadAction<IAppState["appPage"]>) => {
      state.appPage = action.payload
    },
    setAccountsManagerFolder: (state, action: PayloadAction<IAppState["accountsManagerFolder"]>) => {
      state.accountsManagerFolder = action.payload
    },
    setProxyManagerFolder: (state, action: PayloadAction<IAppState["proxyManagerFolder"]>) => {
      state.proxyManagerFolder = action.payload
    },
    setParseManagerFolder: (state, action: PayloadAction<IAppState["parseManagerFolder"]>) => {
      state.parseManagerFolder = action.payload
    },
    setUserAvatar: (state, action:PayloadAction<IAppState["userAvatar"]>) => {
      state.userAvatar = action.payload
    },
    setSmsServisies: (state, action: PayloadAction<IAppState["smsServisies"]>) => {
      state.smsServisies = action.payload
    },
    setSmsServiciesData: (state, action: PayloadAction<IAppState["smsServiciesData"]>) => {
      state.smsServiciesData = action.payload
    },
    setLogs: (state, action: PayloadAction<IAppState["logs"]>) => {
      state.logs = action.payload
    },

    setDistributionFolders: (state, action: PayloadAction<IAppState["distributionFolders"]>) => {
      state.distributionFolders = action.payload;
    },
    addDistributionFolder: (state, action: PayloadAction<IModuleSenderConfig>) => {
      state.distributionFolders?.push(action.payload)
    },

    setDistributionMessageEdit: (state, action: PayloadAction<IAppState["newDistributionMessages"]["open"]>) => {
      state.newDistributionMessages.open = action.payload
    },
    addNewDistributionMessageToEdit: (state, action: PayloadAction<IAppState["newDistributionMessages"]["messages"][0]>) => {
      state.newDistributionMessages.messages.push(action.payload)
    },
  }
})

export const {
  setAppPage,
  setAccountsManagerFolder,
  setProxyManagerFolder,
  setParseManagerFolder,
  setUserAvatar,
  setSmsServisies,
  setSmsServiciesData,
  setLogs,
  setDistributionFolders,
  addDistributionFolder,
  setDistributionMessageEdit,
  addNewDistributionMessageToEdit,
} = appSlice.actions
export default appSlice.reducer
import { IHeaderType } from "../pages/ApplicationPages/AccountsManager/Collumns"
import type { smsServicesTypes } from '../globalTypes'
import type { DeltaStatic } from "quill"

export interface IParseFolders {
  key: React.Key
  title: string,
  dopTitle: string
  latestEdit: Date
  type: 'accounts' | 'groups'
  _id?: string
  accounts?: [
    {
      account_id: number 
      fullInfo: {
        id: number
        is_self: boolean
        contact: boolean
        mutual_contact: boolean
        deleted: boolean
        bot: boolean
        bot_chat_history: boolean
        bot_nochats: boolean
        verified: boolean
        restricted: boolean
        min: boolean
        bot_inline_geo: boolean
        support: boolean
        scam: boolean
        fake: boolean
        bot_attach_menu: boolean
        premium: boolean
        attach_menu_enabled: boolean
        access_hash: string
        first_name: string
        last_name: string
        username: string
        phone: string
        bot_info_version: string
        restriction_reason: string
        bot_inline_placeholder: string
        lang_code: string
        emoji_status: string
        usernames: string
      }
    }
  ] | []
  groups?: [
    {
      group_id: number 
      group_name: string
      fullInfo: {
        id: number
        title: string
        date: Date
        creator: boolean
        left: boolean
        broadcast: boolean
        verified: boolean
        megagroup: boolean
        restricted: boolean
        signatures: boolean
        min: boolean
        scam: boolean
        has_link: boolean
        has_geo: boolean
        slowmode_enabled: boolean
        call_active: boolean
        call_not_empty: boolean
        fake: boolean
        gigagroup: boolean
        noforwards: boolean
        join_to_send: boolean
        join_request: boolean
        forum: boolean
        access_hash: number
        username: string
        restriction_reason: string
        admin_rights: string
        banned_rights: string
        participants_count: number
        usernames: string
      }
    }
  ] | []
}

export interface IUserState {
  nick: string | null,
  mail: string | null,
  defaultAppHash: string | null,
  defaultAppId: number | null,
  id: number | null,
  token: string | null,
  isUserLogined: boolean,
  userManagerFolders: IHeaderType[] | null,
  userProxyFolders: IProxyHeaderType[] | null
  userParsingFolders: IParseFolders[] | null
}

export type smsServicesTypes = {
  title: string,
}

export type smsServiciesDataType = {
  title: string | 'loading',
  balance: number | null | 'loading',
  countries: [{ id: number | string, name: string }] | null | 'loading',
  cost: null | 'loading',
  count: null | 'loading',
}

/**
 * Logs interface 
 */
interface IEntityLogs {
  _id: string
  message: string
  type_message: string
  datetime: Date
}
interface IListLogs {
  _id?: string
  task_id: string
  task_status: string
  task_folder: string
  task_worker: string
  type_log: string
  entity_logs: IEntityLogs[]
  start_time: string
}
export interface ILogs {
  _id?: string
  mail: string
  list_logs: IListLogs[]
}

/** Distribution types */
export interface IAnswer {
  prev: string,
  trigger: string[],
  message: string,
  count_answers: number,
  count_sent: number,
  count_blocked_users: number,
  count_active_users: number,
  count_total_users: number,
  answered_ids: string[],
}
export interface IMSCMessage {
  _id: Schema.Types.ObjectId,
  post_link: string,
  message: string,
  media_message_path: string,
  media_message_type: 'photo' | 'video' | 'audio' | 'document',
  type: 'replies' | 'message',
  used: number,
  status: 'enable' | 'disable',
  createdAt: Date,
  updatedAt: Date,
  answers: IAnswer[],
}
export interface IModuleSenderConfig {
  _id: Schema.Types.ObjectId,
  title: string,
  description: string,
  user_owner_mail: string,
  tg_bots: string[],
  tg_users: string[],
  chats: string[],
  shared_users: string[],
  status: 'created' | 'started' | 'pending' | 'stopped' | 'completed' | 'failure',
  loop_count: number,
  loop_count_max: number,
  time_each_loop: number,
  msg_per_user: number,
  total_msg_users: number,
  type_sender: 'message' | 'replay' | 'bot',
  type_target: 'chats' | 'pm',
  messages: IMSCMessage[],
  total_messages_sent: number,
  createdAt: Date,
  updatedAt: Date,
  msg_append: (msg: IMSCMessage) => void;
}


export interface IAppState {
  appPage: '1' | '2' | '3' | '4' | '5' | '6' | '7' | string
  accountsManagerFolder: React.Key | null
  proxyManagerFolder: React.Key | null
  parseManagerFolder: React.Key | null
  userAvatar: string | null
  smsServisies: smsServicesTypes[] | null
  smsServiciesData: smsServiciesDataType[] | null
  logs: ILogs | null
  distributionFolders: IModuleSenderConfig[] | null
  selectedDistributionFolder: string | null
  newDistributionMessages: {
    open: React.Key | null
    messages:
      {
        id: React.Key | null
        convertedMessage: string | null
        value: Value | null
        rawMessage: Value | null
        title: string | null
        createdAt: Date | null
        updatedAt: Date | null
        status: 'enable' | 'disable' | null
        media: UploadFile<any>[] | null
      }[]
  }
}

export interface IRootStoreState {
  user: IUserState
}
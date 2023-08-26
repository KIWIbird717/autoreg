import { Schema, Model, model, Document } from "mongoose";
import { ErrorService, ErrorType} from "../../utils/errorHandler";


/**
 * interface for `Менеджер аккаунов` page
 */
export interface IAccountsManagerFolder extends Document {
  key: string;
  apiHash: string;
  apiId: number;
  folder: string;
  dopTitle: string;
  accountsAmount: number;
  country: string;
  latestActivity: Date | number;
  banned: number;
  accounts: [
    {
      key: string;
      avatar: string;
      phoneNumber: string;
      resting: Date | number;
      userName: string;
      firstName?: string;
      lastName?: string;
      secondFacAith?: string;  // uness
      proxy?: string;  // uness
      latestActivity: Date;
      status: "success" | "warning" | "error" | string;
      telegramSession: string; // session.json file
      sessionPath: string; // .sesstion file
      apiId?: number;   // uness
      apiHash?: string; // uness
    }
  ];
}


/**
 * interface for `Менеджер proxy` page
 */
interface IProxyManagerFolder extends Document {
  key: string;
  folder: string;
  dopTitle: string;
  proxiesAmount: number;
  country: string;
  latestActivity: Date;
  proxies: [
    {
      key: string;
      ip: string;
      port: string;
      login: string;
      password: string;
      type: string;
      delay: string;
      status: "success" | "error" | string;
    }
  ];
}


/**
 * Interface for Parsing manager
 */
interface IParsingManagerFolders {
  key: string
  title: string
  dopTitle: string
  latestEdit: Date
  type: string
  accounts: [
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
  ]
  groups: [
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
  ]
}

/**
 * interface for `Авторегистратор` page
 * Sidebar component with recent user`s registered accounts
 */
interface IRecentAutoregActivity extends Document {
  key: string;
  status: "success" | "warning" | "error";
  title: string;
  description: string;
  date: Date;
}

/**
 * MAIN USER INTERFACE for MongoDB and all application.
 */
export interface IRegisterUserSchema extends Document {
  nick: string;
  mail: string;
  password: string;
  defaultAppHash: string;
  defaultAppId: number;
  accountsManagerFolder: IAccountsManagerFolder[];
  proxyManagerFolder: IProxyManagerFolder[];
  recentAutoregActivity: IRecentAutoregActivity[];
  parsingManagerFolder: IParsingManagerFolders[];
}

/**
 * User info
 * `Response from MongoDB`
 */
export interface IUserRes {
  _id: string;
  nick: string;
  mail: string;
  password: string;
  defaultAppHash: string;
  defaultAppId: number;
  accountsManagerFolder: IAccountsManagerFolder[];
  proxyManagerFolder: IProxyManagerFolder[];
  recentAutoregActivity: IRecentAutoregActivity[];
  parsingManagerFolder: IParsingManagerFolders[];
  createdAt: Date;
  updatedAt: Date;
  errorList: [{
    service: ErrorService | string;
    status: ErrorType | string;
    message: string;
  }];
  __v: number;
}

// There are Schemas for MongoDB

interface IRegisterUserModel extends Model<IRegisterUserSchema> {}

const AccountsDataSchema = new Schema<IAccountsManagerFolder["accounts"][0]>({
  key: String,
  avatar: String,
  phoneNumber: String,
  resting: Date,
  userName: String,
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  secondFacAith: { type: String, require: false },  // uness
  proxy: { type: String, require: false },  // uness
  latestActivity: { type: Date, require: true },
  status: { type: String, require: true },
  telegramSession: { type: String, require: true }, // session.json file
  sessionPath: { type: String, require: true }, // .sesstion file
  apiId: { type: Number, require: true },   // uness
  apiHash: { type: String, require: true },// uness
})

const AccountsManagerFolderSchema = new Schema<IAccountsManagerFolder>({
  key: String,
  apiHash: String,
  apiId: { type: Number, require: false },
  folder: String,
  dopTitle: String,
  accountsAmount: Number,
  country: String,
  latestActivity: Date,
  banned: Number,
  accounts: [AccountsDataSchema],
});

const ProxyManagerFolderSchema = new Schema<IProxyManagerFolder>({
  key: String,
  folder: String,
  dopTitle: String,
  proxiesAmount: Number,
  country: String,
  latestActivity: Date,
  proxies: [
    {
      key: String,
      ip: String,
      port: String,
      login: String,
      pass: String,
      type: String,
      delay: String,
      status: String,
    },
  ],
});

const ParsingManagerFoldersSchema = new Schema<IParsingManagerFolders>({
  key: String,
  title: String,
  dopTitle: String,
  latestEdit: Date,
  type: String,
  accounts: [
    {
      account_id: Number,
      fullInfo: {
        id: Number,
        is_self: Boolean,
        contact: Boolean,
        mutual_contact: Boolean,
        deleted: Boolean,
        bot: Boolean,
        bot_chat_history: Boolean,
        bot_nochats: Boolean,
        verified: Boolean,
        restricted: Boolean,
        min: Boolean,
        bot_inline_geo: Boolean,
        support: Boolean,
        scam: Boolean,
        fake: Boolean,
        bot_attach_menu: Boolean,
        premium: Boolean,
        attach_menu_enabled: Boolean,
        access_hash: String,
        first_name: String,
        last_name: String,
        username: String,
        phone: String,
        bot_info_version: String,
        restriction_reason: String,
        bot_inline_placeholder: String,
        lang_code: String,
        emoji_status: String,
        usernames: String,
      }
    }
  ],
  groups: [
    {
      group_id: Number,
      group_name: String,
      fullInfo: {
        id: Number,
        title: String,
        date: Date,
        creator: Boolean,
        left: Boolean,
        broadcast: Boolean,
        verified: Boolean,
        megagroup: Boolean,
        restricted: Boolean,
        signatures: Boolean,
        min: Boolean,
        scam: Boolean,
        has_link: Boolean,
        has_geo: Boolean,
        slowmode_enabled: Boolean,
        call_active: Boolean,
        call_not_empty: Boolean,
        fake: Boolean,
        gigagroup: Boolean,
        noforwards: Boolean,
        join_to_send: Boolean,
        join_request: Boolean,
        forum: Boolean,
        access_hash: Number,
        username: String,
        restriction_reason: String,
        admin_rights: String,
        banned_rights: String,
        participants_count: Number,
        usernames: String,
      }
    }
  ]
})

const RecentAutoregActivitySchema = new Schema<IRecentAutoregActivity>({
  key: String,
  status: { type: String, enum: ["success", "warning", "error"] },
  title: String,
  description: String,
  date: Date,
});

const registerUserSchema: Schema = new Schema(
  {
    nick: { type: String, require: true },
    mail: { type: String, require: true },
    defaultAppHash: { type: String, require: true }, // по дефолту "null"
    defaultAppId: { type: Number, require: true }, // по дефолту 0
    password: { type: String, require: true },
    accountsManagerFolder: {
      type: [AccountsManagerFolderSchema],
      require: false,
    },
    proxyManagerFolder: { type: [ProxyManagerFolderSchema], require: false },
    parsingManagerFolder: { type: [ParsingManagerFoldersSchema], require: false },
    // recentAutoregActivity: {
    //   type: [RecentAutoregActivitySchema],
    //   require: false,
    // },
  },
  { timestamps: true, collection: 'users', versionKey: false }
);

/**
 * New `User` DB schema
 *
 * @description
 * Registrate new user in application
 */
export const RegisterUserSchema: IRegisterUserModel = model<IRegisterUserSchema>("RegisterUserSchema", registerUserSchema)

import { ProxyInterface } from "telegram/network/connection/TCPMTProxy";
import { Service, Country } from "../smsService/smsActivate";

interface WaitingForVerify {
  phoneNumber: string;
  code: string | number;
}

interface DeviceInfo {
  os: string;
  device: string;
  appVersion: string | "last";
}

interface phoneVerify {
  service?: Service;
  country?: Country;
  phone?: string;
}

interface userStatistic {
  firstName: string;
  lastName: string;
  userName: string;
  userString?: string;
}

export interface UserSettings {
  language?: "ru" | "en";
  device?: DeviceInfo;
  proxy?: ProxyInterface;
  phone: phoneVerify;
  telegramUser: userStatistic;
  manual?: boolean;
}

interface telegramUserShema {
  phone: string;
  utils: {
    phoneId?: string;
    servicePhone?: Service;
    country?: Country;
    sessionString?: any;
  };
  manual?: boolean;
  userExists: boolean;
  tgUserStats: {
    username: string;
    fisrtName: string;
    lastName: string;
    description: string;
  };
  email: string;
  success: boolean;
}

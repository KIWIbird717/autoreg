import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import { CustomFile } from "telegram/client/uploads";
import { formatPhoneNumber } from "./utils";
import {
  IAccountsManagerFolder,
  RegisterUserSchema,
} from "../../servises/RegisterUserDB/registerUserSchema.servise";
import os from "os";

import {
  rentPhoneRegistration,
  getRegistrationCode,
  getTelegramCode,
  submitPhone,
} from "../smsService/smsActivate";
import { LogLevel } from "telegram/extensions/Logger";

import type {
  telegramUserShema,
  UserSettings,
  WaitingForVerify,
} from "./telegram";
import { logErrorToFile } from "../errorHandler";
export class telegramUser {
  private apiId: number;
  private apiHash: string;
  public statistic: telegramUserShema;
  public client: TelegramClient;
  constructor(apiId: number, apiHash: string, email: string, params: UserSettings) {
    this.apiId = apiId;
    this.apiHash = apiHash;

    this.statistic = {
      phone: "",
      utils: {
        sessionString: new StringSession(params.telegramUser.userString ?? ""),
      },
      userExists: false,
      tgUserStats: {
        username: "",
        fisrtName: "",
        lastName: "",
        description: "",
      },
      email: email,
      success: true
    };

    this.statistic.manual =
      !params.manual && !params.phone.service ? true : params.manual;

    if (this.statistic.manual === true) {
      this.statistic.phone = params.phone.phone;
      this.statistic.utils.servicePhone = null;
    } else {
      this.statistic.utils.servicePhone = params.phone.service;
      this.statistic.utils.country = params.phone.country;
    }

    this.statistic.tgUserStats.fisrtName = params.telegramUser.firstName;
    this.statistic.tgUserStats.lastName = params.telegramUser.lastName;
    this.statistic.tgUserStats.username = params.telegramUser.userName;

    const deviceInfo = params.device ?? {
      os: os.release().toString(),
      device: os.type().toString(),
      appVersion: "",
    };
    const deviceModel = deviceInfo.device;
    const systemVersion = deviceInfo.os;

    const appVersion =
      deviceInfo.appVersion === "last" || deviceInfo.appVersion === ""
        ? "8.0.0"
        : deviceInfo.appVersion;

    const systemLanguage = params.language ?? "en";

    if (!params.proxy) {
      params.proxy = null;
    }

    this.client = new TelegramClient(
      this.statistic.utils.sessionString,
      this.apiId,
      this.apiHash,
      {
        deviceModel: deviceModel,
        systemVersion: systemVersion,
        appVersion: appVersion,
        langCode: systemLanguage,
        systemLangCode: systemLanguage,
        proxy: params.proxy,
      }
    );

    this.client.setLogLevel(LogLevel.ERROR);
    this.statistic.userExists = true;
  }

  public async changeAvatar(url: string): Promise<void> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    const result = await this.client.invoke(
      new Api.photos.UploadProfilePhoto({
        file: await this.client.uploadFile({
          file: new CustomFile(
            "image.jpg",
            imageBuffer.length,
            "image.jpg",
            imageBuffer
          ),
          workers: 1,
        }),
      })
    );
  }

  public async changeUsername(username: string) {
    // Check if the username is available
    const usernameAvailable = await this.client.invoke(
      new Api.account.CheckUsername({
        username: username,
      })
    );

    // If the username is available, set it for the new user
    if (usernameAvailable) {
      await this.client.invoke(
        new Api.account.UpdateUsername({
          username: username,
        })
      );
    } else {
      await this.client.invoke(
        new Api.account.UpdateUsername({
          username: username + `_${Math.floor(Math.random() * 100)}`,
        })
      );
    }
  }

  public async saveUser(): Promise<IAccountsManagerFolder["accounts"][0]> {
    let userId =
      Number(
        RegisterUserSchema.findOne()
          .sort({ "accounts.key": -1 })
          .limit(1)
          .exec()
      ) + 1;

    await this.client.connect();
    const sessionString = this.statistic.utils.sessionString.save();
    await this.client.disconnect();

    return {
      key: userId.toString(),
      avatar: null, // DONT FOGET TO FIX
      phoneNumber: this.statistic.phone,
      resting: 0,
      userName: this.statistic.tgUserStats.username,
      firstName: this.statistic.tgUserStats.fisrtName ?? null,
      lastName: this.statistic.tgUserStats.lastName ?? null,
      secondFacAith: "",
      proxy: "",
      latestActivity: new Date(),
      status: "",
      telegramSession: sessionString,
      sessionPath: '',  // DONT FOGET TO FIX
    };
  }

  public async authorization(): Promise<boolean> {
    if (this.statistic.manual === true) {
      this.statistic.phone = this.statistic.phone;
    } else {
      const telegram_code = await getTelegramCode(this.statistic.utils.servicePhone);
      const phone = await rentPhoneRegistration(
        this.statistic.utils.servicePhone,
        telegram_code,
        this.statistic.utils.country.id
      );
      this.statistic.utils.phoneId = phone.id;
      this.statistic.phone = phone.phoneNumber;
    }

    let isRegistrationRequired = false;
    let termsOfService;

    try {
      const sendCodeResult = await this.client.invoke(
        new Api.auth.SendCode({
          phoneNumber: this.statistic.phone,
          apiId: this.apiId,
          apiHash: this.apiHash,
          settings: new Api.CodeSettings({
            allowFlashcall: false,
            currentNumber: true,
            allowAppHash: true,
          }),
        })
      );

      let phoneCodeHash = sendCodeResult["phoneCodeHash"];
      let isCodeViaApp =
        sendCodeResult["type"].className === "auth.SentCodeTypeApp";
      if (isCodeViaApp === true) {
        throw new Error("CODE_VIA_APP")
      }
      const phoneCode = await this.phoneCode(this.statistic.manual);

      if (phoneCode === null) {
        throw new Error("PHONE_CODE_EMPTY")
      }

      const result = await this.client.invoke(
        new Api.auth.SignIn({
          phoneNumber: this.statistic.phone,
          phoneCodeHash,
          phoneCode,
        })
      );

      if (result instanceof Api.auth.AuthorizationSignUpRequired) {
        isRegistrationRequired = true;
        termsOfService = result.termsOfService;
      }

      if (isRegistrationRequired) {
        let [firstName, lastName] = await this.firstAndLastNames();

        const { user } = (await this.client.invoke(
          new Api.auth.SignUp({
            phoneNumber: this.statistic.phone,
            phoneCodeHash,
            firstName,
            lastName,
          })
        )) as Api.auth.Authorization;

        if (termsOfService) {
          await this.client.invoke(
            new Api.help.AcceptTermsOfService({
              id: termsOfService.id,
            })
          );
        }

        console.log("User registered successfully.");
        logErrorToFile(
          { status: "success", details: { user: this.statistic.phone } },
          "telegram",
          "success",
          this.statistic.email
        );
      } else {
        logErrorToFile(
          { status: "success", details: { user: this.statistic.phone } },
          "telegram",
          "success",
          this.statistic.email
        );
      }
    } catch (err) {
      await logErrorToFile(err, "telegram", "error", this.statistic.email);

      for (const errorMessage of errorMessages) {
        if (err.message.includes(errorMessage)) {
          switch (errorMessage) {
            case "PHONE_NUMBER_BANNED":
            case "AUTH_KEY_UNREGISTERED":
            case "PHONE_CODE_EMPTY":
              await submitPhone(
                this.statistic.utils.servicePhone,
                this.statistic.utils.phoneId,
                false,
                false
              );
              break;

            case "PHONE_NUMBER_INVALID":
            case "PHONE_CODE_INVALID":
              await submitPhone(
                this.statistic.utils.servicePhone,
                this.statistic.utils.phoneId,
                false
              );
              break;

            default:
              this.handleError(new Error (errorMessage))
              break;
          }
          return false;
        }
      }
      return true;
    }
  }

  // Helper functions
  private async firstAndLastNames(): Promise<string[]> {
    this.statistic.userExists = false;
    return [
      this.statistic.tgUserStats.fisrtName,
      this.statistic.tgUserStats.lastName,
    ];
  }

  private async phoneCode(manual: boolean): Promise<string | null> {
    if (manual === true) {
      const codeGenerator = waitForCode(this.statistic.phone);
      const code = await codeGenerator.next();
      return code.value;
    }
    const code = await getRegistrationCode(this.statistic.utils.servicePhone, {
      id: this.statistic.utils.phoneId,
      phoneNumber: this.statistic.phone,
    });
    if (code === null) {
      logErrorToFile(
        new Error("PHONE_CODE_INVALID"),
        "telegram",
        "warn",
        this.statistic.email
      );
      this.statistic.success = false;
      // Valid code from SMS
      await submitPhone(
        this.statistic.utils.servicePhone,
        this.statistic.utils.phoneId,
        false
      );
      return null;
    }
    return code.code;
  }

  private async handleError(err: Error): Promise<boolean> {

    // Check if error message is in the defined error messages
    for (const errorMessage of errorMessages) {
      if (err.message.includes(errorMessage)) {
        // Handle specific error
        switch (errorMessage) {
          case "PHONE_NUMBER_BANNED":
          case "PHONE_CODE_EMPTY":
            await submitPhone(
              this.statistic.utils.servicePhone,
              this.statistic.utils.phoneId,
              false,
              false
            );
            logErrorToFile(new Error(errorMessage), "telegram", "warn");
            break;

          case "AUTH_KEY_UNREGISTERED": // Add this case
            // Implement your error handling logic for AUTH_KEY_UNREGISTERED here
            // For example, log the error and retry the registration process
            logErrorToFile(new Error(errorMessage), "telegram", "warn");
            break;

          default:
            logErrorToFile(new Error(errorMessage), "telegram", "warn");
            break;
        }

        // Stop running `autoRegister`
        return true;
      }
    }

    // If we don't recognize the error message, log it and continue running `autoRegister`
    logErrorToFile(
      new Error(`Telegram register error: ${err}`),
      "telegram",
      "warn"
    );
    return false;
  }
}

// Define error messages
const errorMessages = [
  "PHONE_CODE_EMPTY",
  "PHONE_CODE_EXPIRED",
  "PHONE_CODE_INVALID",
  "PHONE_NUMBER_INVALID",
  "PHONE_NUMBER_UNOCCUPIED",
  "SIGN_IN_FAILED",
  "PHONE_NUMBER_BANNED",
  "AUTH_KEY_UNREGISTERED",
  "CODE_VIA_APP"
];

let maxIdValue;

maxIdValue = RegisterUserSchema.findOne()
  .sort({ "accounts.key": -1 })
  .limit(1)
  .exec();

let waitingForVerify: WaitingForVerify[] = [];

async function* waitForCode(
  phoneNumber: string
): AsyncGenerator<string | number | undefined> {
  while (true) {
    const foundEntry = waitingForVerify.find(
      (entry) => entry.phoneNumber === phoneNumber
    );
    if (foundEntry) {
      // Remove the entry from the waitingForVerify list after using the code
      waitingForVerify = waitingForVerify.filter(
        (entry) => entry.phoneNumber !== phoneNumber
      );
      yield foundEntry.code;
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export function addCodeToWaitingForVerify(
  phoneNumber: string,
  code: string | number
): void {
  waitingForVerify.push({ phoneNumber, code });
}

const ERROR_TYPES = [
  "PHONE_CODE_EMPTY",
  "PHONE_CODE_EXPIRED",
  "PHONE_CODE_INVALID",
  "PHONE_NUMBER_INVALID",
  "PHONE_NUMBER_UNOCCUPIED",
  "SIGN_IN_FAILED",
  "AUTH_KEY_UNREGISTERED", // Add this line
];

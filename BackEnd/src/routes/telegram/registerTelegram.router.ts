import express, { Router, Request, Response } from "express";
import {
  addCodeToWaitingForVerify,
  telegramUser,
} from "../../utils/telegram/telegramRegister.js";
import type { UserSettings } from "../../utils/telegram/telegram.js";
import { testProxyConnectivity } from "../../utils/telegram/utils.js";
import { IUserRes } from "../../servises/RegisterUserDB/registerUserSchema.servise.js";
import { RegisterUserSchema } from "../../servises/RegisterUserDB/registerUserSchema.servise.js";
import { updateUser } from "../../servises/RegisterUserDB/updateUser.servise.js";

const router: Router = express.Router();

/*
What need to containe inside body:
{
  telegramUser: {
    service: "",   REQUIRED
    contryId: "",  REQUIRED
    language: "ru" | "en" NON REQUIRED
  }
  user: {
    email: "",
    tgFolderKey: "",
    proxyFolderKey: "",
    apiId: 0 | "me"
    apiHash: "" | "me"
  }
}
*/
router.post("/auto/register-user", async (req: Request, res: Response) => {
  const { email, tgFolderKey } = req.body.user;
  let proxyFolderData;
  let apiId = 0;
  let apiHash = "";
  const userData: IUserRes | null = await RegisterUserSchema.findOne({
    mail: email,
  }); // All data about user
  if (!userData) {
    res.status(500).json({ error: "User not found in the database" });
  }
  const folderData = userData.accountsManagerFolder.find(
    (folder) => folder.key === tgFolderKey
  ); // Folder of user

  if (req.body.user.apiId === "me") {
    apiId = folderData.apiId;
  } else {
    apiId = req.body.user.apiId;
  }
  if (req.body.user.apiHash === "me") {
    apiHash = folderData.apiHash;
  } else {
    apiHash = req.body.user.apiHash;
  }

  // Implement for auto generating telegramUser
  const language = req.body.user.language;
  const requestUrl =
    language === "ru"
      ? "https://randomuser.me/api/?results=1&inc=name,gender,email,nat,picture&noinfo?nat=RS"
      : "https://randomuser.me/api/?results=1&inc=name,gender,email,nat,picture&noinfo";

  const response = await fetch(requestUrl);
  const data = await response.json();
  const randomUser = data.results[0];

  const userSettings: UserSettings = {
    language: language ?? "en",
    telegramUser: {
      firstName: randomUser.name.first,
      lastName: randomUser.name.last,
      userName: `${randomUser.name.first}_${randomUser.name.last}`,
    },
    phone: {
      service: req.body.telegramUser.service,
      country: { id: req.body.telegramUser.contryId },
    },
    manual: false,
  };

  // if (!/^[a-zA-Z0-9_]+$/.test(userSettings.telegramUser.userName)) {
  //   throw new Error("Not correct username or it's containe non latin alphabet");
  // }

  // Check if the proxyFolderKey is provided
  if (req.body.proxyFolderKey) {
    // Find the folder with the specified proxyFolderKey in the proxyManagerFolder array
    proxyFolderData = userData.proxyManagerFolder.find(
      (folder) => folder.key === req.body.proxyFolderKey
    );

    if (proxyFolderData) {
      // Check if a proxy exists within the folder
      const proxy = proxyFolderData.proxies.find(
        (proxy) => proxy.key === req.body.proxyKey
      );

      if (proxy) {
        // Prepare the proxy settings
        const proxySettings = {
          ip: proxy.ip,
          port: parseInt(proxy.port),
          username: proxy.login,
          password: proxy.pass,
        };

        // Test the proxy connectivity
        const isProxyWorking = await testProxyConnectivity(proxySettings);

        if (isProxyWorking) {
          // Assign the proxy to the userSettings object with the ProxyInterface format
          userSettings.proxy = proxySettings;

          // Update the proxy status to "success"
          proxy.status = "success";
        } else {
          // Update the proxy status to "error"
          proxy.status = "error";
          res.status(500).json({
            error: "The proxy is not working with either SOCKS4 or SOCKS5",
          });
        }
      } else {
        res.status(500).json({ error: "Proxy not found" });
      }
    } else {
      res.status(500).json({ error: "Proxy folder not found" });
    }
  }

  const newUser = new telegramUser(apiId, apiHash, email, userSettings);
  await newUser.authorization();

  const savedUser = await newUser.saveUser();

  // if (randomUser.picture.large) {
  //   newUser.changeAvatar(randomUser.picture.large);
  //   savedUser.avatar = randomUser.picture.large;
  // }

  if (!(req.body.user.apiId === "me")) {
    savedUser.apiId = req.body.user.apiId;
  }
  if (!(req.body.user.apiHash === "me")) {
    savedUser.apiHash = req.body.user.apiHash;
  }

  if (req.body.user.proxyFolderKey) {
    savedUser.proxy = req.body.user.proxyFolderKey;
  }

  if (!savedUser.key) {
    savedUser.key = "0";
  }

  folderData.accounts.push(savedUser);

  // Update the proxyManagerFolder with the modified proxyFolderData
  const updatedProxyFolders = userData.proxyManagerFolder.map((folder) =>
    folder.key === req.body.proxyFolderKey ? proxyFolderData : folder
  );

  if (newUser.statistic.success === false) {
    return res.status(500).json({ error: "Account not registered" });
  }

  updateUser(email, {
    accountsManagerFolder: [folderData],
    proxyManagerFolder: updatedProxyFolders,
  });

  return res.status(200).json({ message: "Success"});
});

router.post("/manual/add-code", async (req: Request, res: Response) => {
  const { code, phone } = req.query;

  if (code === null) {
    return res.status(400).json({ error: "No code" });
  }
  if (phone) {
    return res.status(400).json({ error: "No phone" });
  }

  await addCodeToWaitingForVerify(phone as string, code as string);

  return res.status(200).json({ message: "Success" });
});

export default router;

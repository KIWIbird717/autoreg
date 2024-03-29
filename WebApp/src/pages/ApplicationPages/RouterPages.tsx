import { AutoRegPage } from "./Autoreg/AutoRegPage";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../store/store";
import { useState, useEffect } from "react";
import { IAppState } from "../../store/types";
import { AccountsManagerPage } from "./AccountsManager/AccountsManagerPage";
import { LogsPage } from "./Logs/LogsPage";
import { ProxyManagerPage } from "./ProxyManager/ProxyManagerPage";
import { SettingsPage } from "./Settings/SettingsPage";
import { WarmingUpPage } from "./WarmingUp/WarmingUpPage";
import { DistributoionPage } from "./Distribution/DistributionPage";
import { ParsingPage } from "./ParsingPage/ParsingPage";
import { LogOut } from "../../hooks/LogOut";
import { Route, Routes, useNavigate } from "react-router-dom";
import { InvitingPage } from "./Inviting/InvitingPage";

const MAX_SESSION_DURATION = 10 * 60 * 60 * 1000; // 10 hours in milliseconds

/**
 * Routing system for application
 * Contains `Pages | Layout` for `App.tsx` `<Layout />` cpmponent
 *
 * @description
 * Add more `Route` pages and connect Naviagtion with `<Sider />` component
 */
export const RouterPages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState<IAppState["appPage"]>("1");
  const storedPage = useSelector((state: StoreState) => state.app.appPage);

  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

  /**
   * Chek how logn user is on site
   * And if user on site is longer than 10 hours its logs out
   */
  useEffect(() => {
    const checkTimeout = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastActiveTime;

      if (elapsedTime > MAX_SESSION_DURATION) {
        LogOut(dispatch);
        navigate("/app");
      }
    }, 1000); // check every second

    const handleActivity = () => {
      setLastActiveTime(Date.now());
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      clearInterval(checkTimeout);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [lastActiveTime]);

  // sibar navigation
  useEffect(() => {
    switch (storedPage) {
      case "1":
        navigate("");
        break;

      case "2":
        navigate("app/accounts-manager");
        break;

      case "3":
        navigate("app/proxy-manager");
        break;

      case "4":
        navigate("app/warming-up");
        break;
      case "5":
        navigate("app/distribution");
        break;
      case "6":
        navigate("app/inviting");
        break;

      case "7":
        navigate("app/parsing");
        break;

      case "8":
        navigate("app/logs");
        break;

      case "9":
        navigate("app/settings");
        break;

      default:
        break;
    }
  }, [storedPage]);

  // Pages
  return (
    <>
      <Routes>
        <Route path={"/"} element={<AutoRegPage />} />
        <Route path={"app/accounts-manager"} element={<AccountsManagerPage />} />
        <Route path={"app/proxy-manager"} element={<ProxyManagerPage />} />
        <Route path={"app/warming-up"} element={<WarmingUpPage />} />
        <Route path={"app/distribution"} element={<DistributoionPage />} />

        <Route path={"app/inviting"} element={<InvitingPage />} />
        <Route path={"app/parsing"} element={<ParsingPage />} />
        <Route path={"app/logs"} element={<LogsPage />} />
        <Route path={"app/settings"} element={<SettingsPage />} />
      </Routes>
    </>
  );
};

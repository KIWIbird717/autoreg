import React, { useState } from "react";
import { AccordionStyled } from "../Accordion/AccordionStyled";
import {
  Row,
  Col,
  Popover,
  Input,
  Checkbox,
  Divider,
  Modal,
  Button,
  Segmented,
} from "antd";
import { Typography } from "antd";
import {
  BugOutlined,
  BuildOutlined,
  FolderOpenOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { colors } from "../../../../global-style/style-colors.module";
import { SliderDriwer } from "../../../../components/SliderDrawer/SliderDriwer";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../store/store";
import groupFolder from "../../../../images/groupFolder.svg";
import accountsFolder from "../../../../images/accountsFolder.svg";
import botFolder from "../../../../images/tableCard.svg";

import styles from "../../Autoreg/folder-selection-style.module.css";
import { IParseFolders } from "../../../../store/types";
import { ModalAddNewParsingFolder } from "../ParseFolders/ModalAddNewParsingFolder";
import axios from "axios";
import { message } from "antd";
import { parsingFoldersFromDB } from "../ParseFolders/Folders";
import { useDispatch } from "react-redux";
import { IHeaderType } from "../../AccountsManager/Collumns";
import TaskCompliteWatcher from "../../../../utils/app/taskCompliteWatcher";

const { Title } = Typography;

interface IProps {
  id: number;
  expanded: string | boolean;
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    expanded: boolean
  ) => void;
}

export const ParseChatParticipants = ({ id, expanded, onChange }: IProps) => {
  const dispatch = useDispatch();
  const userMail = useSelector((state: StoreState) => state.user.mail);
  const pasingFoldersRaw: IParseFolders[] | null = useSelector(
    (state: StoreState) => state.user.userParsingFolders
  );
  const accountsFolders = useSelector(
    (state: StoreState) => state.user.userManagerFolders
  );

  const [newFolderModal, setNewFolderModal] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<IParseFolders | null>(
    null
  );
  const [selectedAccountsFolder, setselectedAccountsFolder] =
    useState<IHeaderType | null>(null);

  // Modal
  const [modal, setModal] = useState<boolean>(false);
  const [modalBots, setModalBots] = useState<boolean>(false);

  // Chanale link field
  type chanaleLinkType = { status: "warning" | "error" | ""; link: string };
  const [chanalLink, setChanalLink] = useState<chanaleLinkType>({
    status: "",
    link: "",
  });

  // Chekbox
  const [checkBoxWrited, setCheckBoxWrited] = useState<boolean>(false);

  // Button
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [buttonError, setButtonError] = useState<boolean>(false);
  const [buttonBotSelection, setButtonBotSelection] = useState<boolean>(false);

  const resetFields = () => {
    setButtonLoading(false);
    setButtonError(false);
    setChanalLink({ status: "", link: "" });
    setSelectedFolder(null);
    setCheckBoxWrited(false);
    setselectedAccountsFolder(null);
    setButtonBotSelection(false);
  };

  const runParsing = async () => {
    // Chek filds
    if (!chanalLink.link) {
      setChanalLink({ status: "error", link: "" });
      return;
    }
    if (!selectedAccountsFolder) {
      setButtonBotSelection(true);
      setTimeout(() => {
        setButtonBotSelection(false);
      }, 2_000);
      return;
    }
    if (!selectedFolder) {
      setButtonError(true);
      setTimeout(() => {
        setButtonError(false);
      }, 2000);
      return;
    }
    if (selectedFolder.type != "accounts") {
      message.error("Выберите папку типа 'Акаунты'");
      setButtonError(true);
      setTimeout(() => {
        setButtonError(false);
      }, 2000);
      return;
    }
    if (!accountsFolders || (accountsFolders && accountsFolders.length < 1)) {
      message.error("Нет свободных номеров");
      return;
    }

    // Set button loading
    setButtonLoading(true);

    // url request
    const url = `${process.env.REACT_APP_PYTHON_SERVER_END_POINT}/api/parser/chat-members`;
    try {
      const res = await axios.get(url, {
        params: {
          mail: userMail,
          chat: chanalLink.link,
          folder: selectedAccountsFolder._id,
          folder_to_save: selectedFolder._id,
          writed: checkBoxWrited,
        },
      });

      if (res.status == 200) {
        message.info("Начат парсинг аккаунтов");
        // Run task complite watcher utility
        const taskStatus = await TaskCompliteWatcher(res.data.task_id);
        if (taskStatus === "success") {
          parsingFoldersFromDB(userMail as string, dispatch);
          message.success("Парсинг аккаунтов завершен");
          setButtonLoading(false);
          resetFields();
        } else {
          setButtonLoading(false);
          message.error("Ошибка при парсинге акаунтов");
        }
      }
    } catch (err) {
      setButtonLoading(false);
      message.error("Ошибка при парсинге акаунтов");
      console.error(err);
    }
  };

  return (
    <div className="div" style={{ lineHeight: 0 }}>
      <ModalAddNewParsingFolder
        open={newFolderModal}
        onCancel={() => setNewFolderModal(false)}
        onOk={() => setNewFolderModal(false)}
        setSelectedFolder={setSelectedFolder}
        folder={"accounts"}
      />

      <Modal
        style={{ borderRadius: 20 }}
        title="Выбор папки с аккаунтами"
        open={modalBots}
        onOk={() => setModalBots(false)}
        onCancel={() => setModalBots(false)}
        footer={[
          <Button
            key={1} // Чтобы react не ругался на отсутствие key in map function
            onClick={() => setModalBots(false)}
          >
            Отмена
          </Button>,
        ]}
      >
        <div className="flex flex-col gap-3 my-5">
          <SliderDriwer
            dataSource={accountsFolders || []}
            open={true}
            visibleAmount={3}
            render={(el) => (
              <div
                key={el.key}
                className={`${styles.slider_driwer_folder} flex justify-between w-full rounded-2xl p-3 bg-white`}
                onClick={() => {
                  setselectedAccountsFolder(el);
                  setModalBots(false);
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="h-[110px] object-contain">
                    <img className="w-full h-full" src={botFolder} alt="icon" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Title style={{ margin: "0px 0px" }} level={4}>
                      {el.folder}
                    </Title>
                    <Title
                      style={{ margin: "0px 0px", fontWeight: "400" }}
                      type="secondary"
                      level={5}
                    >
                      {el.dopTitle}
                    </Title>
                    <div className="flex gap-1 items-start">
                      <Title className="m-0" level={5}>
                        {el.accounts.length}
                      </Title>
                      <UserOutlined className="my-1 mt-[5px]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </Modal>

      <Modal
        style={{ borderRadius: 20 }}
        title="Выбор папки для парсинга"
        open={modal}
        onOk={() => setModal(false)}
        onCancel={() => setModal(false)}
        footer={[
          <Button
            key={1} // Чтобы react не ругался на отсутствие key in map function
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setModal(false);
              setNewFolderModal(true);
            }}
          >
            Создать новую папку
          </Button>,
        ]}
      >
        <div className="flex flex-col gap-3 my-5">
          <SliderDriwer
            dataSource={pasingFoldersRaw || []}
            open={modal}
            visibleAmount={3}
            render={(el) => (
              <div
                key={el.key}
                className={`${styles.slider_driwer_folder} flex justify-between w-full rounded-2xl p-3 bg-white`}
                onClick={() => {
                  setSelectedFolder(el);
                  setModal(false);
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="h-[110px] object-contain">
                    <img
                      className="w-full h-full"
                      src={
                        el.type === "accounts" ? accountsFolder : groupFolder
                      }
                      alt="icon"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Title style={{ margin: "0px 0px" }} level={4}>
                      {el.title}
                    </Title>
                    <Title
                      style={{ margin: "0px 0px", fontWeight: "400" }}
                      type="secondary"
                      level={5}
                    >
                      {el.dopTitle}
                    </Title>
                    <div className="flex gap-1 items-start">
                      {el.type == "accounts" ? (
                        <Title className="m-0" level={5}>
                          {el.accounts?.length}
                        </Title>
                      ) : (
                        <Title className="m-0" level={5}>
                          {el.groups?.length}
                        </Title>
                      )}
                      <UserOutlined className="my-1 mt-[5px]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </Modal>

      <AccordionStyled
        title={"Парсинг участников чата"}
        dopTitle={"Парсинг всех доступных участников из телеграм чата"}
        id={id}
        expanded={expanded}
        onChange={onChange}
      >
        <div className="m-2 flex flex-col gap-4">
          <div className="div">
            <Row gutter={20} align={"bottom"}>
              <Col span={12}>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex gap-2 items-center">
                    <Title level={5} style={{ margin: "0 0" }}>
                      Ссылка на телеграм чат
                    </Title>
                    <Popover
                      className="cursor-pointer"
                      title="Ссылка на телеграм чат"
                      content='Ссылку на группу или чат можно взять, нажав "троеточие" -> "info"'
                    >
                      <InfoCircleOutlined />
                    </Popover>
                  </div>
                  <Input
                    size="large"
                    placeholder="Ссылка на телеграм чат"
                    status={chanalLink?.status || ""}
                    value={chanalLink?.link}
                    onChange={(e) =>
                      setChanalLink({ status: "", link: e.currentTarget.value })
                    }
                  />
                </div>
              </Col>
              <Col span={12}>
                <Segmented
                  size="large"
                  options={["По истории", "Лайв режим"]}
                  disabled={true}
                />
              </Col>
            </Row>
          </div>
          <div className="" style={{ lineHeight: 0 }}>
            <Checkbox
              onChange={() => setCheckBoxWrited(!checkBoxWrited)}
              checked={checkBoxWrited}
            >
              <Title
                level={5}
                style={{
                  margin: "0 0",
                  fontWeight: "normal",
                  color: colors.dopFont,
                }}
              >
                Парсить только участников, которые писали в чат
              </Title>
            </Checkbox>
          </div>

          <Divider style={{ margin: "0 0" }} />

          <div className="div">
            <Row gutter={20}>
              <Col span={12}>
                {selectedAccountsFolder ? (
                  <div className="flex gap-2">
                    <div className="h-[40px] object-contain">
                      <img className="w-full h-full" src={botFolder} />
                    </div>
                    <Title
                      level={4}
                      style={{
                        margin: "0 0",
                        fontWeight: "500",
                        cursor: "default",
                      }}
                    >
                      {selectedAccountsFolder.folder}
                    </Title>
                  </div>
                ) : (
                  <Button
                    type="dashed"
                    size="large"
                    icon={<BugOutlined />}
                    danger={buttonBotSelection}
                    onClick={() => setModalBots(true)}
                  >
                    Боты для парсинга
                  </Button>
                )}
              </Col>
              <Col span={12}>
                {selectedFolder ? (
                  <div className="flex gap-2">
                    <div className="h-[40px] object-contain">
                      <img
                        className="w-full h-full"
                        src={
                          selectedFolder.type === "accounts"
                            ? accountsFolder
                            : groupFolder
                        }
                      />
                    </div>
                    <Title
                      level={4}
                      style={{
                        margin: "0 0",
                        fontWeight: "500",
                        cursor: "default",
                      }}
                    >
                      {selectedFolder.title}
                    </Title>
                  </div>
                ) : (
                  <Button
                    type="dashed"
                    size="large"
                    icon={<FolderOpenOutlined />}
                    danger={buttonError}
                    onClick={() => setModal(true)}
                  >
                    Папка для парсинга
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        </div>

        <div className="m-2 mt-9 flex justify-between">
          <Button
            type="link"
            danger={true}
            disabled={
              chanalLink.link ||
              selectedFolder ||
              checkBoxWrited ||
              selectedAccountsFolder
                ? false
                : true
            }
            onClick={() => resetFields()}
          >
            Отмена
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<BuildOutlined />}
            loading={buttonLoading}
            onClick={() => runParsing()}
          >
            Парсить аккаунты
          </Button>
        </div>
      </AccordionStyled>
    </div>
  );
};

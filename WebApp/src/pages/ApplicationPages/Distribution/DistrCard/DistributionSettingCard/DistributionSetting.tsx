import React, { useState, useMemo } from "react";
import {
  Button,
  Divider,
  Input,
  Modal,
  Typography,
  notification,
  Cascader,
  Segmented,
  Col,
  Checkbox,
} from "antd";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { MCard } from "../../../../../components/Card/MCard";
import { colors } from "../../../../../global-style/style-colors.module";
import { CardTitle } from "../../../../../components/CardTitle/CardTitle";
import { MInput } from "../../components/MInput";
import { MailOutlined } from "@ant-design/icons";
import Distribution from "../../../../../images/Distribution.svg";
import { SliderDriwer } from "../../../../../components/SliderDrawer/SliderDriwer";
import { useSelector } from "react-redux";
import type { StoreState } from "../../../../../store/store";
import styles from "../../../Autoreg/folder-selection-style.module.css"
import { IHeaderType } from "../../../AccountsManager/Collumns";
import { IParseFolders } from "../../../../../store/types";
import accountFolderImg from "../../../../../images/accountsFolder.svg"
import botFolderImg from "../../../../../images/tableCard.svg";
import axios from "axios";


const Context = React.createContext({ name: "Default" });
const { Title } = Typography;

export const DistributionSetting = () => {
  const userMail = useSelector((state: StoreState) => state.user.mail)
  // Bots & Accounts from redux storage
  const bots = useSelector((state: StoreState) => state.user.userManagerFolders);
  const accounts = useSelector((state: StoreState) => state.user.userParsingFolders);
  // Bots & Accounts selection
  const [selectedBotsFolder, setSelectedBotsFolder] = useState<IHeaderType | null>(null);
  const [selectedAccountsFolder, setSelectedAccountsFolder] = useState<IParseFolders | null>(null)

  const [_, contextHolder] = notification.useNotification();
  type statusType = { status: "warning" | "error" | ""; link: string };

  const [linkField, setlinkField] = useState<statusType>({
    status: "",
    link: "",
  });

  const [giveRightsModal, setGiveRightsModal] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  // Modals
  const [accountsFolderModal, setAccountsFolderModal] = useState<boolean>(false);
  const [botFolderModal, setBotFolderModal] = useState<boolean>(false);
  
  // firstlly run fields validation, then run handleSubmitDistribution
  const handleFieldsValidation = () => {
    handleSubmitDistribution()
  }

  // on distribution settings submit
  const handleSubmitDistribution = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_END_POINT}/moduleSender/new-distribution`
    try {
      const data = {
        title: 'Test Sender model №1',
        description: "This is test sender model description",
        user_owner_mail: userMail,
        tg_bots: selectedBotsFolder?._id,
        tg_users: selectedAccountsFolder?._id,
        chats: null,
        shared_users: null,
        status: "created",
        loop_count: 5,
        loop_count_max: 10,
        time_each_loop: 5 * 60 * 1000,
        msg_per_user: 1,
        total_msg_users: 20,
        type_sender: "message",
        type_target: "chats",
        messages: [
          {
            message: 'This is test message for user',
            media_message_path: "",
            media_message_type: "text",
            tpye: "message",
          }
        ]
      }
      console.log(data)
      const senderConfigRes = axios.post(api_url, data)
    } catch (err) {
      console.error(err)
    }
  }


  const contextValue = useMemo(() => ({ name: "Ant Design" }), []); // for message component

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}

      {/** Modal for accounts folder */}
      <Modal 
        style={{ borderRadius: 20 }}
        title="Выбор акаунтов для рассылки"
        open={accountsFolderModal}
        onOk={() => setAccountsFolderModal(false)}
        onCancel={() => setAccountsFolderModal(false)}
        footer={[
          <Button
            key={1} // Чтобы react не ругался на отсутствие key in map function
            onClick={() => setAccountsFolderModal(false)}
          >
            Отмена
          </Button>
        ]}
      >
        <div>
          <SliderDriwer 
            dataSource={accounts || []}
            open={accountsFolderModal}
            visibleAmount={3}
            render={(el) => (
              el.type === "accounts" ? (
                <div
                  key={el.key}
                  className={`${styles.slider_driwer_folder} flex justify-between w-full rounded-2xl p-3 bg-white`}
                  onClick={() => {setSelectedAccountsFolder(el); setAccountsFolderModal(false)}}
                >
                  <div className="flex items-center justify-between gap-5">
                    <div className='h-[110px] object-contain'>
                      <img className='w-full h-full' src={accountFolderImg} alt='icon'/>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Title style={{ margin: '0px 0px' }} level={4}>{el.title}</Title>
                      <Title style={{ margin: '0px 0px', fontWeight: '400' }} type='secondary' level={5}>{el.dopTitle}</Title>
                      <div className="flex gap-1 items-start">
                        {el.accounts && <Title className='m-0' level={5}>{el.accounts.length}</Title>}
                        <UserOutlined className='my-1 mt-[5px]' />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                null
              )
            )}
          />
          </div>
      </Modal>
      {/** Modal for bots folders */}
      <Modal
        style={{ borderRadius: 20 }}
        title="Выбор ботов для инвайтинга"
        open={botFolderModal}
        onOk={() => setBotFolderModal(false)}
        onCancel={() => setBotFolderModal(false)}
        footer={[
          <Button
            key={1} // Чтобы react не ругался на отсутствие key in map function
            onClick={() => setBotFolderModal(false)}
          >
            Отмена
          </Button>
        ]}
      >
        <div>
          <SliderDriwer 
            dataSource={bots || []}
            open={botFolderModal}
            visibleAmount={3}
            render={(el) => (
              <div 
                key={el.key} 
                className={`${styles.slider_driwer_folder} flex justify-between w-full rounded-2xl p-3 bg-white`}
                onClick={() => {setSelectedBotsFolder(el); setBotFolderModal(false)}}
              >
                <div className="flex items-center gap-5">
                  <div className='h-[110px] object-contain'>
                    <img className='w-full h-full' src={botFolderImg} alt='icon'/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Title style={{ margin: '0px 0px' }} level={4}>{el.folder}</Title>
                    <Title style={{ margin: '0px 0px', fontWeight: '400' }} type='secondary' level={5}>{el.dopTitle}</Title>
                    <div className="flex gap-1 items-start">
                      <Title className='m-0' level={5}>{el.accounts.length}</Title>
                      <UserOutlined className='my-1 mt-[5px]' />
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
        open={giveRightsModal}
        onOk={() => setGiveRightsModal(false)}
        onCancel={() => setGiveRightsModal(false)}
      />

      <MCard className="w-full p-2 flex gap-3">
        <div className="flex items-center gap-6">
          <img src={Distribution} alt="distribution" />
          <CardTitle
            title="Рассылка"
            dopTitle="Создавайте сообщения для рассылки по группам, чатам или акаунтам, которые вы спарсили."
          />
        </div>

        <div className="flex flex-col gap-5 my-3">
          <div className="flex w-full">
            <MInput
              popoverTitle1="Ссылка на телеграм чат"
              popoverDesription1="Вставьте ссылку на чат или канал куда будет совершаться рассылка"
              item1={
                <Input
                  size="large"
                  placeholder="Ссылка на телеграм чат"
                  value={linkField.link || ""}
                  status={linkField.status}
                />
              }
              item2={
                <div className="w-full flex flex-col gap-1">
                  <div className="flex gap-2 items-center">
                    <Title level={5} style={{ margin: "0 0" }}>
                      Сообщения для рассылки
                    </Title>
                  </div>
                  <Cascader
                    placeholder="Мои сообщения"
                    size="large"
                    className="w-full"
                  />
                </div>
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 my-3">
          <div className="flex w-full">
            <MInput
              popoverTitle1="Боты для рассылки"
              item1={
                <div>
                  <Button 
                    className="w-full" 
                    type="dashed" 
                    size="large"
                    onClick={() => setBotFolderModal(true)}
                  >
                    Боты для рассылки
                  </Button>
                </div>
              }
              popoverTitle2="Акаунты для рассылки"
              item2={
                <div>
                  <Button 
                    className="w-full" 
                    type="dashed" 
                    size="large"
                    onClick={() => setAccountsFolderModal(true)}
                  >
                    Акаунты для рассылки
                  </Button>
                </div>
              }
            />
          </div>
        </div>
        <Divider style={{ margin: "1.2rem 0" }} />
        <div className="flex flex-col gap-5 my-3">
          <div className="flex w-full">
            <MInput
              popoverTitle1="Кол-во сообщений с 1-го бота"
              popoverDesription1=""
              item1={
                <Input
                  size="large"
                  placeholder="Кол-во сообщений с 1-го бота"
                  value={linkField.link || ""}
                  status={linkField.status}
                />
              }
              popoverTitle3="Всего сообщений"
              popoverDesription3=""
              item3={
                <Input
                  size="large"
                  placeholder="Всего сообщений"
                  value={linkField.link || ""}
                  status={linkField.status}
                />
              }
            />
          </div>
        </div>
        <Divider style={{ margin: "1.2rem 0" }} />
        <div className="flex flex-col gap-5 my-3">
          <div className="flex w-full">
            <Col span={24} style={{ padding: "0 0" }}>
              <Segmented
                style={{ padding: "0.5 0.5" }}
                block
                size="large"
                options={["Прямое сообщение", "Репостом", "Из бота"]}
              />
            </Col>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 my-3">
          <div className="flex w-full">
            <Col span={12} style={{ padding: "0 0" }}>
              <Segmented
                style={{ padding: "0.5 0.5" }}
                block
                size="large"
                options={["По личкам", "По чатам"]}
              />
            </Col>

            <Col span={12} style={{ padding: "0 0 0 1", display: 'flex', alignItems: 'center' }}>
              <div className="flex items-center">
                <Checkbox>
                  <Title
                    level={5}
                    style={{
                      margin: "0 0",
                      fontWeight: "normal",
                      color: colors.dopFont,
                    }}
                  >
                    Удалить сообщения у бота
                  </Title>
                </Checkbox>
                <InfoCircleOutlined
                  style={{
                    color: colors.dopFont,
                  }}
                />
              </div>
            </Col>
          </div>
        </div>
        <Divider style={{ margin: "1.2rem 0" }} />

        <Col
          span={12}
          style={{ padding: "0 0 0 0", display: "flex", alignItems: "center" }}
        >
          <Checkbox>
            <Title
              level={5}
              style={{
                margin: "0 0",
                fontWeight: "normal",
                color: colors.dopFont,
              }}
            >
              Цикличность сообщений
            </Title>
          </Checkbox>
          <InfoCircleOutlined
            style={{
              color: colors.dopFont,
            }}
          />
        </Col>
        <div className="flex flex-col gap-5 my-4">
          <div className="flex w-full">
            <MInput
              popoverTitle1="Время циклов"
              popoverDesription1=""
              item1={
                <Input
                  size="large"
                  placeholder="Время циклов"
                  value={linkField.link || ""}
                  status={linkField.status}
                />
              }
              popoverTitle3="Кол-во циклов"
              popoverDesription3=""
              item3={
                <Input
                  size="large"
                  placeholder="Кол-во циклов"
                  value={linkField.link || ""}
                  status={linkField.status}
                />
              }
            />
          </div>
        </div>

        <div className="flex w-full justify-end mt-[30px]">
          <Button
            size="large"
            type="primary"
            icon={<MailOutlined />}
            loading={buttonLoading}
            onClick={() => handleFieldsValidation()}
          >
            Начать рассылку
          </Button>
        </div>
      </MCard>
    </Context.Provider>
  )};

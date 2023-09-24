import React, { useState, useMemo } from "react";
import {
  Button,
  Divider,
  Input,
  Modal,
  Typography,
  notification,
  Segmented,
  Col,
  Checkbox,
  Popover,
  InputNumber,
} from "antd";
import { BugOutlined, FolderOpenOutlined, InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
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
import { IModuleSenderConfig, IParseFolders } from "../../../../../store/types";
import accountFolderImg from "../../../../../images/accountsFolder.svg"
import botFolderImg from "../../../../../images/tableCard.svg";
import axios from "axios";
import { motion } from "framer-motion";
import accountsFolder from '../../../../../images/accountsFolder.svg'
import groupFolder from "../../../../../images/groupFolder.svg"
import { useDispatch } from "react-redux";
import { addDistributionFolder } from "../../../../../store/appSlice";


const Context = React.createContext({ name: "Default" });
const { Title } = Typography;
const { TextArea } = Input;

export const DistributionSetting = () => {
  const dispatch = useDispatch()

  const userMail = useSelector((state: StoreState) => state.user.mail)
  const message = useSelector((state: StoreState) => state.app.newDistributionMessages.messages)
  // Bots & Accounts from redux storage
  const bots = useSelector((state: StoreState) => state.user.userManagerFolders);
  const accounts = useSelector((state: StoreState) => state.user.userParsingFolders);
  // Bots & Accounts selection
  const [selectedBotsFolder, setSelectedBotsFolder] = useState<IHeaderType | null>(null);
  const [selectedAccountsFolder, setSelectedAccountsFolder] = useState<IParseFolders | null>(null)

  const [_, contextHolder] = notification.useNotification();

  const [giveRightsModal, setGiveRightsModal] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  // Modals
  const [accountsFolderModal, setAccountsFolderModal] = useState<boolean>(false);
  const [botFolderModal, setBotFolderModal] = useState<boolean>(false);

  // Type fields
  const [distributionType, setDistributionType] = useState<"Прямое сообщение" | "Репостом" | "Из бота" | null>(null);
  const [dmOrChat, setDmOrChat] = useState<"По личкам" | "По чатам" | null>(null)
  const [messageCycling, setMessageCycling] = useState(false);


  // Distribution config
  interface IDistributionConfig {
    title: { data: string | null, error: boolean }
    description: { data: string | null, error: boolean }
    telegramChatLink: { data: string | null, error: boolean }
    botsFolder: { data: IHeaderType | null, error: boolean }
    accountsFolder: { data: IParseFolders | null, error: boolean }
    msgAmountFrom1Bot: { data: number | null, min?: number, max?: number, error: boolean }
    totalMsgAmount: { data: number | null, min?: number, max?: number, error: boolean }
    repostLink?: { data: string | null, error: boolean }
    cyclesTime?: { data: number | null, min?: number, max?: number, error: boolean }
    cyclesAmount?: { data: number | null, min?: number, max?: number, error: boolean }
    deleteAfterEnd?: { data: boolean }
  }
  const defaultConfig = {
    title: { data: null, error: false },
    description: { data: null, error: false },
    telegramChatLink: { data: null, error: false },
    botsFolder: { data: null, error: false },
    accountsFolder: { data: null, error: false },
    msgAmountFrom1Bot: { data: null, min: 1, max: 999, error: false },
    totalMsgAmount: { data: null, min: 1, max: 999, error: false },
  }
  const [distributionConfig, setDistributionConfig] = useState<IDistributionConfig>(defaultConfig)
  
  // firstlly run fields validation, then run handleSubmitDistribution
  const handleFieldsValidation = () => {
    handleSubmitDistribution()
  }

  // on distribution settings submit
  const handleSubmitDistribution = async () => {
    try {
      const type_senderConverted = (distributionType: "Прямое сообщение" | "Репостом" | "Из бота" | null) => {
        switch (distributionType) {
          case 'Из бота':
            return "bot"
          case "Прямое сообщение":
            return 'message'
          case 'Репостом':
            return 'replay'
        
          default:
            return 'message';
        }
      }

      const type_targetConverted = (type_target: "По личкам" | "По чатам" | null) => {
        switch (type_target) {
          case 'По личкам':
            return "pm"
          case 'По чатам':
            return 'chats'
        
          default:
            return 'pm'
        }
      }

      const data = {
        title: distributionConfig.title.data,
        description: distributionConfig.description.data,
        user_owner_mail: userMail,
        tg_bots: distributionConfig.botsFolder.data?._id,
        tg_users: distributionConfig.accountsFolder.data?._id,
        chats: distributionConfig.telegramChatLink.data,
        status: 'created',
        loop_count: distributionConfig.cyclesAmount?.data,
        time_each_loop: distributionConfig.cyclesTime?.data,
        msg_per_user: distributionConfig.msgAmountFrom1Bot.data,
        total_msg_users: distributionConfig.totalMsgAmount.data,
        type_sender: type_senderConverted(distributionType),
        type_target: type_targetConverted(dmOrChat),
        messages: message.map((message) => ({
          message: message.rawMessage.toString(),
          media: message.media?.map((file) => file.name),
          status: message.status,
          createdAt: Number(new Date(message.createdAt || 0)).toString(),
          updatedAt: Number(new Date()).toString(),
        }))
      }

      const api_url = `${process.env.REACT_APP_SERVER_END_POINT}/moduleSender/new-distribution`
      const newFoldersState = await axios.post(api_url, data);

      /**
       * @description
       * Conver imager to prepared for distribution type
       * <distribution_id/message_id/filename>{*.png,*.jpg,*.jpeg}
       */
      if (newFoldersState.status != 200) return
      const distr: IModuleSenderConfig = newFoldersState.data.senderConfigData
      const preparedMessages = new FormData()
      if (!distr) return
      distr.messages.forEach((msg, index) => {
        if (!message[index].media?.length) return
        //@ts-ignore
        message[index].media.forEach((media) => {
          preparedMessages.append("media", JSON.stringify({ ...media, name: `${distr._id}/${msg._id}/${media.name}` }))
        })
      })

      const upload_url = `${process.env.REACT_APP_SERVER_END_POINT}/moduleSender/new-distributioni-images`
      const uploadedFiles = await axios.post(upload_url, preparedMessages)
      console.log(uploadedFiles)

      dispatch(addDistributionFolder(newFoldersState.data.senderConfigData))
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
                  onClick={() => {
                    setSelectedAccountsFolder(el); 
                    setAccountsFolderModal(false)
                    setDistributionConfig((state) => ({ ...state, accountsFolder: { data: el, error: false } }))
                  }}
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
                onClick={() => {
                  setSelectedBotsFolder(el)
                  setBotFolderModal(false)
                  setDistributionConfig((state) => ({ ...state, botsFolder: { data: el, error: false } }))
                }}
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
          {/** Название рассылки */}
            <MInput
              popoverTitle1="Название рассылки"
              popoverDesription1="Название рассылки"
              item1={
                <Input
                  size="large"
                  placeholder="Название рассылки"
                  value={distributionConfig.title.data || ''}
                  status={distributionConfig.title.error ? 'error' : ''}
                  onChange={(e) => 
                    setDistributionConfig((state) => ({ ...state, title: { data: e.target.value, error: false } }))
                  }
                />
              }
              item2={
                // Описание
                <div className="w-full flex flex-col gap-1">
                  <div className="flex gap-2 items-center">
                    <Title level={5} style={{ margin: "0 0" }}>
                      Описание
                    </Title>
                  </div>
                  <TextArea
                    placeholder="Описание"
                    size="large"
                    className="w-full"
                    rows={1}
                    onChange={(e) => 
                      setDistributionConfig((state) => ({ ...state, description: { data: e.target.value, error: false } }))
                    }
                  />
                </div>
              }
            />
          </div>

          <div className="flex w-full">
            {/** Ссылка на телеграм чат */}
            <MInput
              popoverTitle1="Ссылка на телеграм чат"
              popoverDesription1="Вставьте ссылку на чат или канал куда будет совершаться рассылка"
              item1={
                <Input
                  size="large"
                  placeholder="Ссылка на телеграм чат"
                  value={distributionConfig.telegramChatLink.data || ""}
                  status={distributionConfig.telegramChatLink.error ? "error" : ""}
                  onChange={(e) => 
                    setDistributionConfig((state) => ({ ...state, telegramChatLink: { data: e.target.value, error: false } }))
                  }
                />
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 my-3">
          <div className="flex w-full">
            {/** Боты для рассылки */}
            <MInput
              popoverTitle1="Боты для рассылки"
              item1={
                <div>
                  {selectedBotsFolder ? (
                    <div className="flex gap-2">
                      <div className="h-[40px] object-contain">
                        <img className='w-full h-full' src={botFolderImg}/>
                      </div>
                      <Title level={4} style={{margin: '0 0', fontWeight: '500', cursor: 'default'}}>{selectedBotsFolder?.folder}</Title>
                    </div>
                  ) : (
                    <Button 
                      type="dashed"
                      size='large'
                      icon={<BugOutlined />}
                      danger={distributionConfig.botsFolder.error}
                      style={{ width: '100%' }}
                      onClick={() => setBotFolderModal(true)}
                    >Боты для рассылки</Button>
                  )}
                </div>
              }
              popoverTitle2="Акаунты для рассылки"
              // Акаунты для рассылки
              item2={
                <div>
                  {selectedAccountsFolder ? (
                    <div className="flex gap-2">
                      <div className="h-[40px] object-contain">
                      <img className='w-full h-full' src={selectedAccountsFolder.type === 'accounts' ? accountsFolder : groupFolder}/>
                      </div>
                      <Title level={4} style={{margin: '0 0', fontWeight: '500', cursor: 'default'}}>{selectedAccountsFolder.title}</Title>
                    </div>
                  ) : (
                    <Button 
                      type="dashed"
                      size='large'
                      icon={<FolderOpenOutlined />}
                      danger={distributionConfig.accountsFolder.error}
                      style={{ width: '100%' }}
                      onClick={() => setAccountsFolderModal(true)}
                    >Акаунты для рассылки</Button>
                  )}
                </div>
              }
            />
          </div>
        </div>
        <Divider style={{ margin: "1.2rem 0" }} />
        <div className="flex flex-col gap-5 my-3">
          <div className="flex w-full">
            {/** Кол-во сообщений с 1-го бота */}
            <MInput
              popoverTitle1="Кол-во сообщений с 1-го бота"
              popoverDesription1=""
              item1={
                <InputNumber
                  size="large"
                  placeholder="Кол-во сообщений с 1-го бота"
                  value={distributionConfig.msgAmountFrom1Bot.data}
                  status={distributionConfig.msgAmountFrom1Bot.error ? 'error' : ''}
                  min={distributionConfig.msgAmountFrom1Bot.min}
                  max={distributionConfig.msgAmountFrom1Bot.max}
                  style={{ width: '100%' }}
                  onChange={(e) => 
                    setDistributionConfig((state) => ({ ...state, msgAmountFrom1Bot: { data: Number(e), error: false } }))
                  }
                />
              }
              popoverTitle3="Всего сообщений"
              popoverDesription3=""
              item3={
                /** Всего сообщений */
                <InputNumber
                  size="large"
                  placeholder="Всего сообщений"
                  style={{ width: '100%' }}
                  value={distributionConfig.totalMsgAmount.data}
                  status={distributionConfig.totalMsgAmount.error ? 'error' : ''}
                  min={distributionConfig.totalMsgAmount.min}
                  max={distributionConfig.totalMsgAmount.max}
                  onChange={(e) => 
                    setDistributionConfig((state) => ({ ...state, totalMsgAmount: { data: Number(e), error: false } }))
                  }
                />
              }
            />
          </div>
        </div>
        <Divider style={{ margin: "1.2rem 0" }} />
        <div className="flex flex-col gap-5 my-3">
          <div className="flex w-full">
            <Col span={24} style={{ padding: "0 0" }}>
              {/** Distribution type */}
              <Segmented
                style={{ padding: "0.5 0.5" }}
                block
                size="large"
                options={["Прямое сообщение", "Репостом", "Из бота"]}
                onChange={(e) => setDistributionType(e as "Прямое сообщение" | "Репостом" | "Из бота")}
              />
            </Col>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 my-3">
          <div className="flex w-full">
            <Col span={12} style={{ padding: "0 0" }}>
              {/** DM or Chat distribution */}
              <Segmented
                style={{ padding: "0.5 0.5" }}
                block
                size="large"
                options={["По личкам", "По чатам"]}
                onChange={(e) => {
                  if (e === "По личкам") {
                    setMessageCycling(false)
                  }
                  setDmOrChat(e as "По личкам" | "По чатам")
                }}
              />
            </Col>

            <Col span={12} style={{ padding: "0 0 0 1", display: 'flex', alignItems: 'center' }}>
              <div className="flex items-center">
                {/** Check box delete message */}
                <Checkbox
                  onChange={() => setDistributionConfig((state) => ({ ...state, deleteAfterEnd: { data: !state.deleteAfterEnd?.data } }))}
                >
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
          {/** Ссылка на репост */}
          <div className="relative w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: dmOrChat === 'По чатам' ? 1 : 0 }}
            >
              {/** Checkbox  Цикличность сообщений */}
              <Checkbox
                checked={messageCycling}
                disabled={dmOrChat === 'По чатам' ? false : true}
                onChange={(e) => setMessageCycling((state) => !state)}
                style={{ cursor: 'default' }}
              >
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
            </motion.div>
          </div>
        </Col>
        <div className="flex gap-5 my-4">
          {/** Репостом */}
          <motion.div 
            className="w-[50%] mt-1 flex flex-col gap-1"
            style={{ display: distributionType === 'Репостом' ? 'block' : 'none' }}
          >
            <div className="flex gap-2 items-center ml-1">
              <Title level={5} style={{ margin: "0 0" }}>
                Ссылка на репост
              </Title>
              <Popover
                className="cursor-pointer"
                title={'Ссылка на репост'}
                content={'Ссылка на репост'}
              >
                <InfoCircleOutlined />
              </Popover>
            </div>
            <Input
              size="large"
              placeholder="Ссылка на репост"
              value={distributionConfig.repostLink?.data || ''}
              status={distributionConfig.repostLink?.error ? 'error' : ''}
              onChange={(e) => 
                setDistributionConfig((state) => ({ ...state, repostLink: { data: e.target.value, error: false } }))
              }
            />
          </motion.div>
          {/** Циклы */}
          <motion.div 
            className="flex w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: messageCycling ? 1 : 0 }}
          >
            <div className="flex">
              <MInput
                popoverTitle1="Время циклов"
                popoverDesription1=""
                item1={
                  <InputNumber
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Время циклов"
                    min={distributionConfig.cyclesTime?.min}
                    max={distributionConfig.cyclesTime?.max}
                    value={distributionConfig.cyclesTime?.data}
                    status={distributionConfig.cyclesTime?.error ? 'error' : ''}
                    disabled={!messageCycling}
                    onChange={(e) => 
                      setDistributionConfig((state) => ({ ...state, cyclesTime: { data: e, error: false } }))
                    }
                  />
                }
                
                popoverTitle3="Кол-во циклов"
                popoverDesription3=""
                item3={
                  <InputNumber
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Кол-во циклов"
                    min={distributionConfig.cyclesAmount?.min}
                    max={distributionConfig.cyclesAmount?.max}
                    value={distributionConfig.cyclesAmount?.data}
                    status={distributionConfig.cyclesAmount?.error ? 'error' : ''}
                    disabled={!messageCycling}
                    onChange={(e) => 
                      setDistributionConfig((state) => ({ ...state, cyclesAmount: { data: e, error: false } }))
                    }
                  />
                }
              />
            </div>
          </motion.div>
        </div>

        <div className="flex w-full justify-end mt-[30px]">
          <Button
            size="large"
            type="primary"
            icon={<MailOutlined />}
            loading={buttonLoading}
            onClick={() => handleFieldsValidation()}
          >
            Добавить рассылку
          </Button>
        </div>
      </MCard>
    </Context.Provider>
  )};

import React, { useState, useRef, useMemo } from 'react';
import { Button, Checkbox, Divider, Input, InputNumber, Modal, Typography, notification } from 'antd';
import { MCard } from '../../../../../components/Card/MCard'
import { CardTitle } from '../../../../../components/CardTitle/CardTitle'
import { MInput } from '../../components/MInput';
import { IHeaderType } from '../../../AccountsManager/Collumns';
import { BugOutlined, FolderOpenOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { IParseFolders } from '../../../../../store/types';
import { useSelector } from 'react-redux';
import { message } from 'antd'
import styles from "../../../Autoreg/folder-selection-style.module.css"

import userInviting from "../../../../../images/userInvitiong.svg";
import botFolderImg from "../../../../../images/tableCard.svg";
import groupsFolderImg from "../../../../../images/groupFolder.svg";
import accountsFolderImg from "../../../../../images/accountsFolder.svg"
import accountFolderImg from "../../../../../images/accountsFolder.svg"
import { colors } from '../../../../../global-style/style-colors.module';
import { StoreState } from '../../../../../store/store';
import axios from 'axios';
import { SliderDriwer } from '../../../../../components/SliderDrawer/SliderDriwer';
import TaskCompliteWatcher from '../../../../../utils/app/taskCompliteWatcher';

const Context = React.createContext({ name: 'Default' })
const { Title } = Typography;
const MAX_INVITES_FROM_1_BOT: Readonly<number> = 50;

interface IOpenNotification {
  type: "warning" | "success" | "error"
  msg: string
  description: string
}


export const UserInviting = () => {
  const [api, contextHolder] = notification.useNotification();
  
  const userMail = useSelector((state: StoreState) => state.user.mail);
  // Bots & Accounts
  const bots = useSelector((state: StoreState) => state.user.userManagerFolders);
  const accounts = useSelector((state: StoreState) => state.user.userParsingFolders);
  // Bots & Folder selection
  const [selectedBotsFolder, setSelectedBotsFolder] = useState<IHeaderType | null>(null);
  const [selectedAccountsFolder, setSelectedAccountsFolder] = useState<IParseFolders | null>(null)
  const [botsButton, setBotsButton] = useState({ error: false, disabled: false });
  const [folderButton, setFolderButton] = useState({ error: false, disabled: false });
  // Link input
  type statusType = {status: "warning" | "error" | "", link: string}
  const [linkField, setlinkField] = useState<statusType>({status: "", link: ""});
  // Number Input
  type inviteType = { invites: number | null, max: number, min: number } | null;
  const [invitesFrom1Bot, setInvitesFrom1Bot] = useState<inviteType>(null);
  const invitesFrom1BotBounds = useRef({ max: MAX_INVITES_FROM_1_BOT, min: 1 });  // this bounds are const
  const [totalInvites, setTotalInvites] = useState<inviteType>(null);
  // Leave chekbox
  const [leaveCheckbox, setLeaveCheckbox] = useState<boolean>(false);
  // Modal
  const [botFolderModal, setBotFolderModal] = useState<boolean>(false);
  const [accountsFolderModal, setAccountsFolderModal] = useState<boolean>(false);
  //Buttons
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);


  const openNotification = ({ type, msg, description }: IOpenNotification) => {
    api[type]({
      message: msg,
      description: description,
      placement: 'bottomRight'
    });
  }


  const leaveGoupUfter = async (selectedBotsFolder: IHeaderType) => {
    try {
      const URL_LEAVE_GROUP = `${process.env.REACT_APP_PYTHON_SERVER_END_POINT}/api/inviter/group/admin_add`
      const res = await axios.get(URL_LEAVE_GROUP, {
        params: {
          mail: userMail,
          bots_folder: selectedBotsFolder._id,
          chat_link: linkField.link,
          step: 'remove_bots',
        }
      })

      // Run leave status watcher
      const leaveStatuse = await TaskCompliteWatcher(res.data.task_id);
      if (leaveStatuse === 'success') {
        message.success("Боты успешно покинули группу");
        setButtonLoading(false);
      } else {
        message.error("Ошибка во время выхода ботов из группы");
        setButtonLoading(false);
        return;
      }
    } catch (err) {
      console.error(err);
      setButtonLoading(false);
      return;
    }
  }


  const runInviting = async () => {
    // Validate fields
    if (!linkField.link) {
      setlinkField((state) => ({ ...state, status: "error" }));
      return;
    }
    if (!selectedBotsFolder) {
      setBotsButton((state) => ({ ...state, error: true }));
      setTimeout(() => {
        setBotsButton((state) => ({ ...state, error: false }));
      }, 2_000);
      return;
    }
    if (!selectedAccountsFolder) {
      setFolderButton((state) => ({ ...state, error: true }));
      setTimeout(() => {
        setFolderButton((state) => ({ ...state, error: false }));
      }, 2_000);
      return;
    }

    // Set button loading
    setButtonLoading(true);
    message.success("Начался инвайтинг");

    // url request
    const URL = `${process.env.REACT_APP_PYTHON_SERVER_END_POINT}/api/inviter`;
    try {
      const res = await axios.get(URL, {
        params: {
          mail: userMail,
          chat_link: linkField.link,
          bots: selectedBotsFolder._id,
          participants: selectedAccountsFolder._id,
          leave: leaveCheckbox,
        }
      });

      if (res.data.code == 200) {
        openNotification({
          type: 'success',
          msg: "Инвайтинг начался",
          description: `Инайтинг начал свою робату в группе ${linkField.link}. Сделаите за логами для получения большей информации`,
        })
      } else {
        openNotification({
          type: 'error',
          msg: "Инвайтинг отклонен",
          description: "Проверте правильность ссылок, наличие ботов и акаунтов",
        })
        setButtonLoading(false);
        return;
      }

      // Complite Inviting watcher
      const invitingStatus = await TaskCompliteWatcher(res.data.task_id);
      if (invitingStatus === 'success') {
        message.success("Инвайтинг успешно завершен");
        await leaveGoupUfter(selectedBotsFolder);
      } else {
        message.error("Произошла ошибка во время инвайтинга");
        setButtonLoading(false);
        return;
      }
    } catch (err) {
      console.error(err);
      setButtonLoading(false);
      return;
    }
  }

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), [])  // for message component
  
  return (
    <Context.Provider value={contextValue}>
    {contextHolder}
    <Modal 
      style={{ borderRadius: 20 }}
      title="Выбор акаунтов для инвайтинга"
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

    <MCard className='w-full p-2 flex gap-3'>
      <div className="flex items-center gap-6">
        <img src={userInviting} alt='adming'/>
        <CardTitle 
          title="Инвайтинг user"
          dopTitle='Добавляйте акаунты в группы и каналы от имени пользователя'
        />
      </div>

      <div className="flex flex-col gap-5 my-9">
        <div className="flex w-full">
          <MInput 
            popoverTitle1='Ссылка на телеграм чат'
            popoverDesription1='Вставьте ссылку на чат или канал куда будут инватиться акаунты'
            item1={
              <Input 
                size='large'
                placeholder='Ссылка на телеграм чат'
                value={linkField.link || ""}
                status={linkField.status}
                onChange={(e) => setlinkField({status: "", link: e.target.value})}
              />
            }
          />
        </div>

        <div>
          <MInput 
            popoverTitle1='Боты для инвайтинга'
            popoverDesription1='Выберите папку с ботами'
            item1={
              selectedBotsFolder ? (
                <div className="flex gap-2">
                  <div className="h-[40px] object-contain">
                    <img className='w-full h-full' src={botFolderImg}/>
                  </div>
                  <Title level={4} style={{margin: '0 0', fontWeight: '500', cursor: 'default'}}>{selectedBotsFolder.folder}</Title>
                </div>
              ) : (
                <div>
                  <Button 
                    className='w-full'
                    type="dashed"
                    size='large'
                    icon={<BugOutlined />}
                    danger={botsButton.error}
                    onClick={() => setBotFolderModal(true)}
                  >Боты для парсинга</Button>
                </div>
              )
            }
            popoverTitle2='Акаунты для инвайтинга'
            popoverDesription2='Выберите папку с акаунтами, которые будут инвайтиться'
            item2={
              selectedAccountsFolder ? (
                <div className="flex gap-2">
                  <div className="h-[40px] object-contain">
                    <img className='w-full h-full' src={selectedAccountsFolder.type === 'accounts' ? accountsFolderImg : groupsFolderImg}/>
                  </div>
                  <Title level={4} style={{margin: '0 0', fontWeight: '500', cursor: 'default'}}>{selectedAccountsFolder.title}</Title>
                </div>
              ) : (
                <div>
                  <Button 
                    className='w-full'
                    type="dashed"
                    size='large'
                    icon={<FolderOpenOutlined />}
                    danger={folderButton.error}
                    onClick={() => setAccountsFolderModal(true)}
                  >Акаунты</Button>
                </div>
              )
            }
          />
        </div>

        <Divider style={{ margin: '0 0' }} />

        <MInput 
          popoverTitle1='Объём инвайтов с 1-го бота'
          popoverDesription1='Укажите количество инвайтов, которые будут происходить с одного бота'
          item1={
            <InputNumber 
              className='w-full'
              size='large'
              value={invitesFrom1Bot?.invites}
              onChange={(e) => setInvitesFrom1Bot((state) => (state ? { ...state, invites: e } : null))}
              max={invitesFrom1BotBounds.current.max}
              min={invitesFrom1BotBounds.current.min}
              disabled={true}
            />
          }
          popoverTitle2='Всего ивайтов'
          popoverDesription2='Введите сколько акаунтов будет добавлено в группу или чат'
          item2={
            <InputNumber 
              className='w-full'
              size='large'
              value={totalInvites?.invites}
              onChange={(e) => setTotalInvites((state) => (state ? { ...state, invites: e } : null))}
              max={totalInvites?.max || 0}
              min={totalInvites?.min || 0}
              disabled={true}
            />
          }
        />

        <Divider style={{ margin: '0 0' }} />

        <div className="" style={{ lineHeight: 0 }}> 
          <Checkbox 
            onChange={() => setLeaveCheckbox(!leaveCheckbox)}
            checked={leaveCheckbox}
          >
            <Title level={5} style={{ margin: '0 0', fontWeight: 'normal', color: colors.dopFont }}>Покинуть чат ботам после окончания инвайта</Title>
          </Checkbox>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <Button
          size='large'
          type='primary'
          icon={<MailOutlined />}
          onClick={() => runInviting()}
          loading={buttonLoading}
        >
          Начать инвайтинг
        </Button>
      </div>
    </MCard>
    </Context.Provider>
  )
}

import React, { useState, useMemo, useEffect } from "react";
import { Input, Modal, notification } from "antd";
import { MCard } from "../../../../../components/Card/MCard";
import { CardTitle } from "../../../../../components/CardTitle/CardTitle";
import { PlusCircleFilled } from "@ant-design/icons";
import { NewMessenge } from "../../components/NewMessenge";
import { useDispatch, useSelector } from "react-redux";
import { addNewDistributionMessageToEdit, setDistributionMessageEdit } from "../../../../../store/appSlice";
import type { StoreState } from "../../../../../store/store";
import groupFolder from "../../../../../images/groupFolder.svg";
import TextArea from "antd/es/input/TextArea";

const Context = React.createContext({ name: "Default" });

export const DistributionMessage = () => {
  const [_, contextHolder] = notification.useNotification();
  const [addNewMessageModal, setAddNewMessageModal] = useState(false)
  type StatusType = 'error' | 'warning' | "";
  type NewMessageModalDataType = Partial<{ title: {data: string, status: StatusType}, description: {data: string, status: StatusType} }>;
  const [newMessageModalData, setNewMessageModalData] = useState<NewMessageModalDataType | null>(null);

  const contextValue = useMemo(() => ({ name: "Ant Design" }), []); // for message component

  // Created or excisting messages
  const messages = useSelector((state: StoreState) => state.app.newDistributionMessages.messages)
  const dispatch = useDispatch()

  const addNewMessageToDistribution = () => {
    if (!newMessageModalData?.title?.data) return;


    const newId = Math.max(...messages.map((message) => Number(message.id))) + 1
    const initState = {
      id: newId === -Infinity ? 0 : newId,
      convertedMessage: null,
      value: null,
      rawMessage: null,
      title: newMessageModalData.title.data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'disable' as 'enable' | 'disable' | null,
    }
    dispatch(addNewDistributionMessageToEdit(initState));
    dispatch(setDistributionMessageEdit(initState.id));
  }

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <Modal
        style={{ borderRadius: 20 }}
        open={addNewMessageModal}
        onOk={() => {
          if (!newMessageModalData?.title?.data) {
            setNewMessageModalData((state) => ({ ...state, title: { data: "", status: 'error' } }))
            return;
          }
          if (!newMessageModalData.description?.data) {
            setNewMessageModalData((state) => ({ ...state, description: { data: "", status: 'error' } }))
            return;
          }
          addNewMessageToDistribution();
          setNewMessageModalData(null);
          setAddNewMessageModal(false);
        }}
        onCancel={() => {
          setNewMessageModalData(null);
          setAddNewMessageModal(false);
        }}
      >
        <div className={`w-[100%] my-8 flex items-center gap-4`}>
          <div className="object-contain h-[130px]">
            <img className='h-full' src={groupFolder} alt='table card'/>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Input 
              size="large" 
              placeholder="Название рассылки" 
              value={newMessageModalData?.title?.data || ""}
              status={newMessageModalData?.title?.status || ""}
              onChange={(e) => setNewMessageModalData((state) => ({ ...state, title: { data: e.target.value, status: "" } }))}
            />
            <TextArea
              value={newMessageModalData?.description?.data || ""}
              status={newMessageModalData?.description?.status || ""}
              placeholder="Добавьте описание"
              onChange={(e) => setNewMessageModalData((state) => ({ ...state, description: { data: e.target.value, status: "" } }))}
              autoSize={{ minRows: 2, maxRows: 5 }}
              showCount
              maxLength={50}
            />
          </div>
        </div>
      </Modal>

      <MCard className="block">
        <div className="flex items-center mb-1">
          <CardTitle title="Мои сообщения" />
        </div>
        <div className="flex justify-start items-baseline scroll_bar_style snap-mandatory snap-x croll-smooth overflow-auto">
          {messages.map((message) => (
            <NewMessenge key={message.id} message={message} popoverTitle={message.title || ''} />
          ))}
          <div className="flex ml-5 snap-end">
            <button 
              className="w-[8rem] p-3 h-[124px] bg-inherit border-0 hover:bg-slate-100 rounded-md cursor-pointer"
              onClick={() => setAddNewMessageModal(true)}
            >
              <PlusCircleFilled
                style={{
                  fontSize: "36px",
                  color: " #e6e6ee",
                }}
              />
            </button>
          </div>
        </div>
      </MCard>
    </Context.Provider>
  );
};

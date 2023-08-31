import React, { useState, useMemo } from "react";
import { Modal, notification } from "antd";
import { MCard } from "../../../../../components/Card/MCard";
import { CardTitle } from "../../../../../components/CardTitle/CardTitle";
import { PlusCircleFilled } from "@ant-design/icons";
import { NewMessenge } from "../../components/NewMessenge";
import { useSelector } from "react-redux";
import type { StoreState } from "../../../../../store/store";

const Context = React.createContext({ name: "Default" });

export const DistributionMessage = () => {
  const [_, contextHolder] = notification.useNotification();
  const [giveRightsModal, setGiveRightsModal] = useState<boolean>(false);

  const contextValue = useMemo(() => ({ name: "Ant Design" }), []); // for message component

  const messages = useSelector((state: StoreState) => state.app.newDistributionMessages.messages)

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <Modal
        style={{ borderRadius: 20 }}
        open={giveRightsModal}
        onOk={() => setGiveRightsModal(false)}
        onCancel={() => setGiveRightsModal(false)}
      />

      <MCard className="w-full flex ">
        <div className="flex items-center mb-1">
          <CardTitle title="Мои сообщения" />
        </div>
        <div className="w-full flex flex-row justify-start items-baseline">
          {messages.map((message) => (
            <NewMessenge key={message.id} popoverTitle={message.title || ''} />
          ))}
          <div className="flex ml-5">
            <button 
              className="w-[8rem] p-3 h-[124px] bg-inherit border-0 hover:bg-slate-100 rounded-md cursor-pointer"
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

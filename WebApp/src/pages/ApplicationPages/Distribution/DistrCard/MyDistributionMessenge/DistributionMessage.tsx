import React, { useState, useMemo } from "react";
import { Modal, notification } from "antd";
import { MCard } from "../../../../../components/Card/MCard";
import { CardTitle } from "../../../../../components/CardTitle/CardTitle";
import { PlusCircleFilled } from "@ant-design/icons";
import { NewMessenge } from "../../components/NewMessenge";

const Context = React.createContext({ name: "Default" });

export const DistributionMessage = () => {
  const [_, contextHolder] = notification.useNotification();
  const [giveRightsModal, setGiveRightsModal] = useState<boolean>(false);

  const contextValue = useMemo(() => ({ name: "Ant Design" }), []); // for message component

  const dummyData = {
    messagesTemplate: [
      {
        id: 0,
        titile: 'Рассылка для newsTV 1'
      },
      {
        id: 1,
        titile: 'Рассылка для newsTV 2'
      },
      {
        id: 2,
        titile: 'Рассылка для newsTV 3'
      },
    ]
  }

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
          {dummyData.messagesTemplate.map((message) => (
            <NewMessenge key={message.id} popoverTitle={message.titile} />
          ))}
          <div className="flex ml-5">
            <PlusCircleFilled
              style={{
                fontSize: "36px",
                color: " #e6e6ee",
              }}
            />
          </div>
        </div>
      </MCard>
    </Context.Provider>
  );
};

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
import { InfoCircleOutlined } from "@ant-design/icons";
import { MCard } from "../../../../../components/Card/MCard";
import { colors } from "../../../../../global-style/style-colors.module";
import { CardTitle } from "../../../../../components/CardTitle/CardTitle";
import { MInput } from "../../components/MInput";
import { MailOutlined } from "@ant-design/icons";
import Distribution from "../../../../../images/Distribution.svg";

const Context = React.createContext({ name: "Default" });
const { Title } = Typography;
const MAX_INVITES_FROM_1_BOT: Readonly<number> = 50;

export const DistributionSetting = () => {
  const [api, contextHolder] = notification.useNotification();
  type statusType = { status: "warning" | "error" | ""; link: string };
  const [linkField, setlinkField] = useState<statusType>({
    status: "",
    link: "",
  });
  const [giveRightsModal, setGiveRightsModal] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const contextValue = useMemo(() => ({ name: "Ant Design" }), []); // for message component

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
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
              popoverTitle1="Боты для инвайтинга"
              item1={
                <>
                  <div>
                    <Button className="w-full" type="dashed" size="large">
                      Новая папка+
                    </Button>
                  </div>
                </>
              }
              popoverTitle2="Акаунты для инвайтинга"
              item2={
                <>
                  <div>
                    <Button className="w-full" type="dashed" size="large">
                      Новая папка+
                    </Button>
                  </div>
                </>
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
                  placeholder="5"
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
                options={["По личкам", "По чатам"]}
              />
            </Col>

            <Col span={12} style={{ padding: "0 0 0 1" }}>
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
        {/* <div className="flex flex-col gap-5 my-3">
          <div className="flex w-full">
            <MInput
              popoverTitle1="Ссылка на репост"
              popoverDesription1=""
              item1={
                <Input
                  size="large"
                  placeholder="Вставить ссылку"
                  value={linkField.link || ""}
                  status={linkField.status}
                />
              }
            />
          </div>
        </div> */}
        {/* Репостом*/}

        {/* <Col
          span={12}
          style={{ padding: "0 0 3 0", display: "flex", alignItems: "center" }}
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
        </Col> */}
        {/* Цикличность выключена */}

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

        <div className="flex w-full justify-end">
          <Button
            size="large"
            type="primary"
            icon={<MailOutlined />}
            loading={buttonLoading}
          >
            Начать рассылку
          </Button>
        </div>
      </MCard>
    </Context.Provider>
  );
};

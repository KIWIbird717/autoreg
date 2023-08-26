import React, { useState, useMemo } from "react";
import {
  Button,
  Divider,
  Typography,
  notification,
  Upload,
  Modal,
  Input,

} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MailOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { MCard } from "../../../../../components/Card/MCard";
import { CardTitle } from "../../../../../components/CardTitle/CardTitle";
import { MIinput_temp } from "../../components/MIinput_temp";
import styles from './styles.module.scss';

const Context = React.createContext({ name: "Default" });
const { Title } = Typography;

export const TextEditor = () => {
  const [api, contextHolder] = notification.useNotification();
  const [value, setValue] = React.useState("");
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const contextValue = useMemo(() => ({ name: "Ant Design" }), []); // for message component
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  var toolbarOptions = [[]];
  const module = {
    toolbar: toolbarOptions,
  };
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const [giveRightsModal, setGiveRightsModal] = useState<boolean>(false);
  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <Modal
        style={{ borderRadius: 20 }}
        open={giveRightsModal}
        onOk={() => setGiveRightsModal(false)}
        onCancel={() => setGiveRightsModal(false)}
      />

      <MCard className="w-full flex gap-3">
        <div className="flex items-center gap-6 mb-3">
          <CardTitle title="Редактор сообщений" />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex w-full">
            <MIinput_temp
              popoverTitle1="Добавить медиа файлы"
              item1={
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                >
                    {fileList.length < 10 && "+ Загрузить"}
                </Upload>
              }
            />
          </div>
        </div>
        <Divider style={{ margin: "1.2rem 0" }} />
        <div className="flex flex-col items-end gap-5 my-3">
          <div className="flex w-full ">
            <MIinput_temp
              item2={
                <div className="w-full flex flex-col gap-1">
                  <div className="flex gap-2 items-center">
                    <ReactQuill
                      className="w-[26rem] h-[10.2rem]"
                      theme="snow"
                      value={value}
                      onChange={setValue}
                      modules={module}
                      placeholder="Написать сообщение"
                    />
                  </div>
                </div>
              }
              item3={
                <div className="w-full flex flex-col gap-1 items-center">
                  <div className="flex gap-2 items-center">
                    <Title level={5} style={{ margin: "0 0" }}>
                      Ссылка на страницу
                    </Title>
                  </div>

                  <Input size="large" placeholder="Ссылка на ваш акк.." />
                </div>
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
            Добавить сообщение
          </Button>
        </div>
      </MCard>
    </Context.Provider>
  );
};

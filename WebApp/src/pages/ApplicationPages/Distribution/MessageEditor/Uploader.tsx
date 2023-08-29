import { useState } from 'react';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import styles from "./styles.module.scss"

const { Title } = Typography;


const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Загрузить</div>
  </div>
);

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const Uploader = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // const clearFileList = newFileList.map((file) => {
    //   return {
    //     ...file,
    //     status: 'done'
    //   }
    // })
    //@ts-ignore
    setFileList(newFileList);
  }


  return (
    <section className={`${styles.uploaderWrapper} scroll_bar_style snap-mandatory snap-x croll-smooth flex flex-col gap-1 overflow-auto`}>
      <Title level={5} style={{ margin: 0, marginLeft: 5 }}>Добавить медиа</Title>
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length < 10 ? uploadButton : null}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </section>
  )
}

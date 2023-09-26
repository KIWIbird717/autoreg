import styles from "../styles.module.scss"
import { useState } from 'react';
import { Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { handlePreview, handleCancel } from './handlePreview';
import type { UploadFile, UploadProps } from 'antd/es/upload';

const { Title } = Typography;


const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Загрузить</div>
  </div>
);


export function Uploader({ fileList, setFileList }: { fileList: UploadFile<any>[], setFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>> }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList((state) => [...state, file]);
      return false;
    },
    onChange: (files) => setFileList(files.fileList),
    onPreview: (file) => handlePreview({ file, setPreviewImage, setPreviewOpen, setPreviewTitle }),
    fileList: fileList,
    listType: "picture-card",
    maxCount: 8,
  }

  return (
    <section className={`${styles.uploaderWrapper} scroll_bar_style snap-mandatory snap-x croll-smooth flex flex-col gap-1 overflow-auto`}>
      <Title level={5} style={{ margin: 0, marginLeft: 5 }}>Добавить медиа</Title>
      <Upload {...props}>
        {fileList.length < 5 ? uploadButton : null}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => handleCancel(setPreviewOpen)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </section>
  )
}

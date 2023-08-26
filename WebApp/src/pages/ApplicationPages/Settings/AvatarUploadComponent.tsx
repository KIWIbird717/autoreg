import React, { useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'
import type { RcFile, UploadProps } from 'antd/es/upload'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { setUserAvatar } from '../../../store/appSlice'

type PreviewStatus = 'done' | 'uploading' | 'error' | null

export const AvatarUploadComponent = () => {
  const dispatch = useDispatch()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState<string>('')
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const getBase64 = (file: RcFile): Promise<string> => (
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  )

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
      dispatch(setUserAvatar(file.url || (file.preview as string)))
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    setPreviewStatus('done')
    // dispatch(setUserAvatar(file.url || (file.preview as string)))
  }
  
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => (
    setFileList(newFileList)
  )

  return (
    <div className="flex flex-col items-center gap-3">
      <Upload 
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        <Button icon={<UploadOutlined />}>Загрузить аватар</Button>
      </Upload>
    </div>
  )
}

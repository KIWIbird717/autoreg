import { useState } from 'react'
import tableCard from '../../../images/tableCard.svg'
import { Input, Popover, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Title } = Typography

interface IProps {
  className?: string
  folderTitle: {label: string, value: "" | "warning" | "error" | undefined} | null
  folderDescription: {label: string, value: "" | "warning" | "error" | undefined} | null
  setFolderTitle: (e: any) => void
  setFolderDescription: (e: any) => void

  apiHashInput: {label: string, value: "" | "warning" | "error" | undefined} | null
  apiIdInput: {label: number, value: "" | "warning" | "error" | undefined} | null
  setApiHashInput: (e: any) => void
  setApiIdInput: (e: any) => void
}

export const FolserSelection = ({
  className, 
  folderTitle, 
  folderDescription, 
  setFolderTitle, 
  setFolderDescription,
  apiHashInput,
  apiIdInput,
  setApiHashInput,
  setApiIdInput
}: IProps): JSX.Element => {

  return (
    <div className={`w-[100%] flex items-start gap-3 ${className}`}>
      <div className="object-contain h-[130px]">
        <img className='h-full' src={tableCard} alt='table card'/>
      </div>
      <div className="flex flex-col gap-3 w-[45%]">
        <Input 
          size="large" 
          placeholder="Название папки"
          status={folderTitle?.value || ""} 
          value={folderTitle?.label}
          onChange={(e) => setFolderTitle({label: e.currentTarget.value, value: ""})}
        />
        <TextArea
          status={folderDescription?.value || ""}
          value={folderDescription?.label}
          onChange={(e) => setFolderDescription({label: e.target.value, value: ""})}
          placeholder="Добавьте описание"
          autoSize={{ minRows: 2, maxRows: 5 }}
          // showCount
          maxLength={50}
        />
      <div className="flex gap-3 w-full">
        <div className="flex gap-2">
          <Input 
            placeholder="App hash"
            status={apiHashInput?.value || ""} 
            value={apiHashInput?.label}
            onChange={(e) => setApiHashInput({label: e.currentTarget.value, value: ""})}
          />
          <Popover className='cursor-pointer' title="App hash" content='Инструкция по получению App hash https://my.telegram.org/auth'>
            <InfoCircleOutlined />
          </Popover>
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="App Id"
            status={apiIdInput?.value || ""} 
            value={apiIdInput?.label}
            onChange={(e) => setApiIdInput({label: e.currentTarget.value, value: ""})}
          />
          <Popover className='cursor-pointer' title="App Id" content='Инструкция по получению App Id https://my.telegram.org/auth'>
            <InfoCircleOutlined />
          </Popover>
        </div>
      </div>
      </div>
    </div>
  )
}

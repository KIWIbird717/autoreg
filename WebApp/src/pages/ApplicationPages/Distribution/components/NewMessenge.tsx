import { Dropdown, Typography } from "antd/";
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, FileTextTwoTone, MinusCircleOutlined } from "@ant-design/icons";
import { colors } from "../../../../global-style/style-colors.module";
import { useDispatch, useSelector } from "react-redux";
import { deleteDistributionMessageEdit, setDistributionMessageEdit, updateDistributionMessageEdit } from "../../../../store/appSlice";
import type { MenuProps } from "antd/";
import type { IAppState } from "../../../../store/types";
import type { StoreState } from "../../../../store/store";

const { Title } = Typography;

interface IProps {
  popoverTitle: string;
  message: IAppState["newDistributionMessages"]["messages"][0]
}

export const NewMessenge = ({ popoverTitle, message }: IProps) => {
  const dispatch = useDispatch()
  const openMessage = useSelector((state: StoreState) => state.app.newDistributionMessages.open)

  const items: MenuProps['items'] = [
    {
      key: 0,
      label: message.status === 'disable' ? 'Активировать' : 'Деактивировать',
      icon: message.status === 'disable' ? <CheckCircleOutlined /> : <MinusCircleOutlined />,
      onClick: () => {
        if (message.status === 'disable') {
          dispatch(updateDistributionMessageEdit({ id: message.id, status: 'enable' }))
        } else {
          dispatch(updateDistributionMessageEdit({ id: message.id, status: 'disable' }))
        }
      }
    },
    {
      key: 1,
      label: 'Редактировать',
      icon: <EditOutlined />,
      onClick: () => {
        dispatch(setDistributionMessageEdit(message.id as number))
      }
    },
    {
      key: 2,
      type: 'divider',
    },
    {
      key: '3',
      label: 'Удалить',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        dispatch(deleteDistributionMessageEdit(message.id))
        dispatch(setDistributionMessageEdit(null))
      }
    }
  ]

  return (
    <Dropdown
      menu={{ items }}
    >
      <div className={`${message.id === openMessage && 'bg-sky-100'} ease-out duration-100 flex flex-col gap-3 items-center justify-center w-[8rem] p-3 hover:bg-slate-100 rounded-md snap-end`}>
        <div className="flex items-center justify-center">
          <FileTextTwoTone
            type="primary"
            style={{ fontSize: "58px", color: colors.primary }}
          />
        </div>
        <div style={{ lineHeight: 1.1 }} className="flex justify-center text-center">{popoverTitle}</div>
      </div>
    </Dropdown>
  );
};

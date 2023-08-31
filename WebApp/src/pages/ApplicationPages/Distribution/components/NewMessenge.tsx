import { Typography } from "antd/";
import { FileTextTwoTone } from "@ant-design/icons";
import { colors } from "../../../../global-style/style-colors.module";

const { Title } = Typography;

interface IProps {
  popoverTitle: string;
}

export const NewMessenge = ({ popoverTitle }: IProps) => {
  return (
    <>
      <div className="flex flex-col gap-3 items-center justify-center w-[8rem] p-3 hover:bg-slate-100 rounded-md">
        <div className="flex items-center justify-center">
          <FileTextTwoTone
            type="primary"
            style={{ fontSize: "58px", color: colors.primary }}
          />
        </div>
        <div style={{ lineHeight: 1.1 }} className="flex justify-center text-center">{popoverTitle}</div>
      </div>
    </>
  );
};

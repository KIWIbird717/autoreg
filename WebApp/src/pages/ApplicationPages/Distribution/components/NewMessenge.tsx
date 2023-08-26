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
      <div className="flex flex-col items-center justify-center w-[8rem] p-3 hover:bg-[#e6e6ee] rounded">
        <div className="flex items-center justify-center">
          <FileTextTwoTone
            type="primary"
            style={{ fontSize: "68px", width: "68px", color: colors.primary }}
          />
        </div>
        <div className="flex justify-center text-center">{popoverTitle}</div>
      </div>
    </>
  );
};

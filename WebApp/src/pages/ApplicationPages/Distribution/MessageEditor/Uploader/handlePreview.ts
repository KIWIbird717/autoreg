import type { UploadFile, RcFile } from "antd/es/upload";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface IHandlePreview{
  file: UploadFile
  setPreviewImage: React.Dispatch<React.SetStateAction<string>>
  setPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>
  setPreviewTitle: React.Dispatch<React.SetStateAction<string>>
}
export const handlePreview = async ({ file, setPreviewImage, setPreviewOpen, setPreviewTitle }: IHandlePreview) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj as RcFile);
  }

  setPreviewImage(file.url || (file.preview as string));
  setPreviewOpen(true);
  setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
};

export const handleCancel = (setPreviewOpen: IHandlePreview["setPreviewOpen"]) => setPreviewOpen(false);
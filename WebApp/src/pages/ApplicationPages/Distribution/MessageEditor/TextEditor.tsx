import ReactQuill from "react-quill";
import styles from "./styles.module.scss";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import { useState } from "react"; 
import { useSelector } from "react-redux";
import type { UnprivilegedEditor, Value } from "react-quill";
import type { DeltaStatic, Sources } from "quill";
import type { StoreState } from "../../../../store/store";
import { useDispatch } from "react-redux";
import { updateDistributionMessageEdit } from "../../../../store/appSlice";


export const TextEditor = ({ className }: { className?: string }) => {
  const dispatch = useDispatch();

  const openedDocument = useSelector((state: StoreState) => state.app.newDistributionMessages.open);
  const messages = useSelector((state: StoreState) => state.app.newDistributionMessages.messages);
  const editedMessage = messages.filter((message) => message.id === openedDocument)[0];

  type StateType = {value: Value, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor} | null
  const [state, setState] = useState<StateType>(null);


  const handleChange = (value: Value, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
    if (openedDocument == null || openedDocument == undefined) return;
    if (value === '<p><br></p>') return;
    dispatch(updateDistributionMessageEdit(
      { 
        id: editedMessage.id, 
        value: value, 
        rawMessage: editor.getContents(),  
      }
    ))
    setState({ value, delta, source, editor });
  };

  return (
    <div className={className}>
      <EditorToolbar />
      <ReactQuill 
        theme="snow"
        value={editedMessage?.value || ''}
        className={styles.textEditor}
        onChange={(value, delta, source, editor) => handleChange(value, delta, source, editor)}
        placeholder={"Сообщение для рассылки..."}
        modules={modules}
        formats={formats}
      />
    </div>
  )
}

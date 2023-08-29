import ReactQuill from "react-quill";
import styles from "./styles.module.scss";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import { useState } from "react"; 
import type { UnprivilegedEditor, Value } from "react-quill";
import type { DeltaStatic, Sources } from "quill";


export const TextEditor = ({ className }: { className?: string }) => {
  //@ts-ignore
  const [state, setState] = useState<Value | undefined>({ value: null })
  const handleChange = (value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
    //@ts-ignore
    setState({ value });
    console.log({ value, delta, source, editor })
  };

  return (
    <div className={className}>
      <EditorToolbar />
      <ReactQuill 
        theme="snow"
        //@ts-ignore
        value={state.value}
        className={styles.textEditor}
        onChange={(value, delta, source, editor) => handleChange(value, delta, source, editor)}
        placeholder={"Сообщение для рассылки..."}
        modules={modules}
        formats={formats}
      />
    </div>
  )
}

import { useEffect } from "react";
import { Quill } from "react-quill";
import styles from "./styles.module.scss"

let Inline = Quill.import('blots/inline');


// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// handle monospace option
class MonospaceBlot extends Inline {}
MonospaceBlot.blotName = 'monospace';
MonospaceBlot.tagName = 'tt';
Quill.register(MonospaceBlot);


// handle user insert
function userInsertHandler() {
  //@ts-ignore
  const cursorPosition = this.quill.getSelection().index;
  //@ts-ignore
  this.quill.insertText(cursorPosition, "@<user_name>");
  //@ts-ignore
  this.quill.setSelection(cursorPosition + 12);
}

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      user: userInsertHandler,
    }
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  }
};

// Formats objects for setting up the Quill editor
export const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "link",
  "code",
  "monospace",
];

// Quill Toolbar component
export const QuillToolbar = () => (
  <div id="toolbar" className={styles.toolBar}>
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button id="ql-monospace" className="ql-monospace">
        M
      </button>
      <button className="ql-underline" />
      <button className="ql-strike" />
      <button className="ql-code" />
      <button className="ql-link" />
      <button className="ql-user">@</button>
    </span>
  </div>
);

export default QuillToolbar;
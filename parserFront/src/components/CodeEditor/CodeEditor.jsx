import styles from "./CodeEditor.module.css";

export const CodeEditor = ({ code, onCodeChange }) => {
  return (
    <>
      <textarea
        id="code-editor"
        className={styles.editor}
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Write your code here..."
      ></textarea>
    </>
  );
};

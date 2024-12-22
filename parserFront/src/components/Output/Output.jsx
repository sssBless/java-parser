import styles from "./Output.module.css";

export const Output = ({ output }) => {
  return (
    <div className={styles.output}>
      <h3>Output</h3>
      <pre id="output-field">{output}</pre>
    </div>
  );
};

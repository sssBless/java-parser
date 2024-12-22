import { CodeEditor } from "./components/CodeEditor/CodeEditor";
import { Layout } from "./components/Layout/Layout";
import styles from "./App.module.css";
import { useEffect, useState } from "react";
import { Button } from "./components/Button/Button";
import { Output } from "./components/Output/Output";
import { History } from "./components/History/History";
import RunIcon from "./assets/ic_run.svg";
import SaveIcon from "./assets/ic_save.svg";

import ApiService from "./utils/ApiService";
import AutoIncrement from "./utils/IdGenerator";

const apiService = new ApiService("http://localhost:3000");
const autoIncrement = new AutoIncrement(1);

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await apiService.get("/files");
      setHistory(response);
    }
    fetchData();
  }, []);

  const handleCodeChange = (value) => {
    setCode(value);
    if (selectedFile) {
      setSelectedFile({ ...selectedFile, body: value });
    }
  };

  const handleRun = async () => {
    try {
      const response = await apiService.executeCode(code);
      setOutput(response.result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedFile) {
        const updatedHistory = history.map((file) =>
          file.id === selectedFile.id
            ? { ...file, body: selectedFile.body }
            : file
        );
        setHistory(updatedHistory);

        await apiService.patch(selectedFile.id, { body: selectedFile.body });
        console.log("File updated:", selectedFile);
      } else {
        const id = autoIncrement.getNextValue();
        const data = {
          id,
          name: `file${id}.txt`,
          body: code,
        };

        const response = await apiService.post("/files", data);
        const history = await apiService.get("/files");

        setHistory(history);

        console.log(response);
      }

      setSelectedFile(null);
      setCode("");
      setOutput("");
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setCode(file.body);
  };

  return (
    <>
      <Layout>
        <div className={styles.codeEditor}>
          <div className={styles.buttons}>
            <Button
              id={"execute-button"}
              label="Run"
              onClick={handleRun}
              bgcColor={"green"}
              imgComponent={RunIcon}
            />
            <Button
              id={"save-button"}
              label="Save"
              onClick={handleSave}
              imgComponent={SaveIcon}
            />
          </div>
          <CodeEditor code={code} onCodeChange={handleCodeChange} />
        </div>
        <div className={styles.history}>
          <History history={history} onFileSelect={handleFileSelect} />
        </div>

        <div className={styles.output}>
          <Output output={output} />
        </div>
      </Layout>
    </>
  );
}

export default App;

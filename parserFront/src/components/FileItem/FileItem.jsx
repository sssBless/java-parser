import { useState } from "react";
import styles from "./FileItem.module.css";
import { Button } from "../Button/Button";
import InstallIcon from "../../assets/ic_install.svg";
import RedactIcon from "../../assets/ic_redact.svg";

export const FileItem = ({ file, onSave, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fileName, setFileName] = useState(file.name);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave(file.id, fileName);
    setIsEditing(false);
  };

  const handleNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleDownloadClick = () => {
    const fileContent = file.body;

    const blob = new Blob([fileContent], { type: "text/plain" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = () => {
    onSelect(file); // Передаем файл в родительский компонент
  };

  return (
    <li className={styles.listItem} onClick={handleFileSelect}>
      {isEditing ? (
        <>
          <input type="text" value={fileName} onChange={handleNameChange} />{" "}
          <Button label={"save"} onClick={handleSaveClick} />
        </>
      ) : (
        <>
          <span>{fileName}</span>
          <>
            <Button onClick={handleDownloadClick} imgComponent={InstallIcon} />
            <Button
              onClick={handleEditClick}
              label={"redact"}
              imgComponent={RedactIcon}
            />
          </>
        </>
      )}
    </li>
  );
};

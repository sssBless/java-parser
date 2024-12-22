import { FileItem } from "../FileItem/FileItem";
import styles from "./History.module.css";

export const History = ({ history, onFileSelect }) => {
  const handleSave = async (id, newName) => {
    try {
      const response = await apiService.patch(id, { name: newName });
      console.log(response);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className={styles.history}>
      <h3>Saved Files</h3>
      <ul>
        {history &&
          history.map((item) => (
            <FileItem
              file={item}
              key={item.id}
              onSave={handleSave}
              onSelect={onFileSelect} // Обработчик выбора файла
            />
          ))}
      </ul>
    </div>
  );
};

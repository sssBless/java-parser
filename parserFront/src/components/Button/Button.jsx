import styles from "./Button.module.css";

export const Button = ({ id, imgComponent, label, bgcColor, onClick }) => {
  return (
    <>
      <button
        id={id}
        onClick={onClick}
        className={styles.button}
        style={{ backgroundColor: bgcColor }}
      >
        {imgComponent && (
          <img src={imgComponent} alt="icon" className={styles.icon} />
        )}
        {label}
      </button>
    </>
  );
};

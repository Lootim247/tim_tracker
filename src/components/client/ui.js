import styles from '@/styles/Components.module.css'

export function ButtonTT({onclick, text}){
    return (<button className={styles.button} onClick={()=>{onclick()}}>{text}</button>)
}

export function SwitchTT({ value, onChange, disabled = false }) {
  const handleClick = () => {
    if (!disabled) onChange(!value);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      disabled={disabled}
      onClick={handleClick}
      className={`${styles.switch} ${value ? styles.on : styles.off} ${
        disabled ? styles.disabled : ""
      }`}
    >
      <span className={styles.thumb} />
    </button>
  );
}
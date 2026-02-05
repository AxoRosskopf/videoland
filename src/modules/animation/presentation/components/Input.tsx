import { Dispatch, SetStateAction } from 'react';
import styles from './input.module.css';

type InputProps = {
  action: Dispatch<SetStateAction<string | null>>;
};

const Input = ({ action }: InputProps) => {
  return (
    <div className={styles.inputBox}>
      <input
        type="text"
        className={styles.input}
        placeholder="Type here..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const value = e.currentTarget.value.trim();
            action(value === '' ? null : value);
            e.currentTarget.value = '';
          }
        }}
      />
    </div>
  );
};

export default Input;

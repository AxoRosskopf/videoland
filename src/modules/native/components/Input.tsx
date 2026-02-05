import styles from './input.module.css'
const Input = () => {
  return <input 
            type="text" 
            className={styles.input}
            placeholder="Type here..."
        />
  
}

export default Input
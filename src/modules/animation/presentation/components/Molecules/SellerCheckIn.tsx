import { useState } from 'react';
import CheckIn from '../CheckIn'
import Seller from '../Seller'
import styles from './seller-checkin.module.css';

const SellerCheckIn = () => {
  const [status, setStatus] = useState('idle');
return (
    <div 
      className={styles.container}
      onMouseEnter={() => setStatus('hover')}
      onMouseLeave={() => setStatus('idle')}
    >
      <div className={styles.back}>
        <Seller animationStatus={status} />
      </div>
      <div className={styles.front}>
        <CheckIn />
      </div>
    </div>
  )
}

export default SellerCheckIn
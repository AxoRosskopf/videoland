import { useEffect, useState } from 'react';
import CheckIn from '../CheckIn'
import Seller from '../Seller'
import styles from './seller-checkin.module.css';
import Waiting from '../Waiting';

const SellerCheckIn = ({ loading } : { loading: boolean }) => {
  const [status, setStatus] = useState('idle');
  useEffect(() => {
    if (loading) {
      setStatus('thinking');
    } else {
      setStatus('idle');
    }
  }, [loading]);
return (
    <div 
      className={styles.container}
      onMouseEnter={() => {
        if(!loading){
          setStatus('hover')
        }
      }}
      onMouseLeave={() => {
        if(!loading){
          setStatus('idle')
        }
      }}
    >
      <div className={styles.waiting}>
        {loading ? <Waiting /> : null}
      </div>
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
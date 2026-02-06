import { useEffect, useMemo } from 'react';
import { useAddDecorator } from '../hooks/use-add-decorator';
import useAnimationController from '../hooks/use-animation-controller';
import useFetchSprite from '../hooks/use-fetch-sprite';
import styles from './seller.module.css';

const Seller = ({ animationStatus = 'idle' }) => {
  const { sprite : sellerIdle } =  useFetchSprite('Seller');
  
  const { spriteDecorated : sellerHover } = useAddDecorator({ 
    baseSprite: sellerIdle,
    config: {
        nameFrameAdded: 'hover',
        fileName: 'SellerHover'
    }
  });

  const animationCollection = useMemo(() => ({
    "idle": {
      sprite: sellerIdle,
      interval: 300,
      cssVar: '--tarantino'
    },
    "hover": {
      sprite: sellerHover,
      interval: 300,
      cssVar: '--tarantino'
    }
  }), [sellerIdle, sellerHover]);
  const {objectRef , setAnimation} = useAnimationController(animationCollection); 
  useEffect(() => {
    if (animationStatus) {
        setAnimation(animationStatus);
    }
  }, [animationStatus, setAnimation]);

  return (
    <div>
        <div 
          ref={objectRef} 
          className={styles.tarantino}
        />
    </div>
  )
}

export default Seller
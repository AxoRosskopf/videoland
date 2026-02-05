import { useMemo } from 'react';
import { useAddDecorator } from '../hooks/use-add-decorator';
import useAnimationController from '../hooks/use-animation-controller';
import useFetchSprite from '../hooks/use-fetch-sprite';
import styles from './seller.module.css';

const Seller = () => {
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
      cssVar: '--tarantino-hover'
    }
  }), [sellerIdle, sellerHover]);

  const {objectRef , setAnimation} = useAnimationController(animationCollection); 
  return (
    <div>
        <div 
          ref={objectRef} 
          className={styles.tarantino}
          onMouseEnter={() => setAnimation('hover')}
          onMouseLeave={() => setAnimation('idle')}
        />
    </div>
  )
}

export default Seller
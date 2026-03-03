import React from 'react'
import useFetchSprite from '../hooks/use-fetch-sprite';

const Billboard = () => {
  const { sprite } = useFetchSprite('Billboard');
  return <div 
        style={{
            backgroundImage: `url(${sprite?.getFramesData()[0]})`,
            width: `${sprite?.getWidth()}px`,
            height: `${sprite?.getHeight()}px`,
            imageRendering: 'pixelated'
        }}  />
}

export default Billboard
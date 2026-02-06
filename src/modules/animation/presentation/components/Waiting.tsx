import { useEffect, useState } from "react"
import useFetchSprite from "../hooks/use-fetch-sprite"

const Waiting = () => {
  const {sprite} = useFetchSprite('Sphere')
  const [i, setI] = useState(0)
  useEffect(()=>{
    const interval = setInterval(()=>{
        setI(prev => (prev +1) % 3)
    },500)
    return () => clearInterval(interval)
  },[i])
 return (
    <div
        style={{
            display: 'flex',
            gap: '0.1rem',
        }}
    >
        {Array.from({length: 3}).map((_, index) => (
            <div
                key={index}
                style={{
                    backgroundImage: `url(${sprite?.getFramesData()[0]})`,
                    width: `${sprite?.getWidth()}px`,
                    height: `${sprite?.getHeight()}px`,
                    imageRendering: 'pixelated',
                    transform: 'scale(0.6)',
                    opacity: i === index ? 1 : 0.3,
            }}  />
        ))}
    </div>
 )
}

export default Waiting
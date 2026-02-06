import { useEffect, useRef, useState } from 'react'
import { pixelit} from '../../../../lib/pixelit'
import styles from './movie-item.module.css'
import ReactDOM from 'react-dom'; 

const MovieItem = ({ movie }: any) => {
  if (!movie || !movie.poster_path) {
    return null;
  }
  const [pos,setPos] = useState({x:0, y:0}) 
  const [visible, setVisible] = useState(false);

  const [imgHeight, setImgHeight] = useState<number | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return

    const applyPixelify = () => {
      const px = new pixelit({
        from: img,
        to: canvas,
        scale: 14,
        maxWidth: 150,
        maxHeight: 225
      })
      px.draw().pixelate()
    }

    img.onload = applyPixelify
    img.onerror = () => console.error("Failed to load image:", img.src)

    if (img.complete && img.naturalWidth !== 0) {
      applyPixelify()
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [movie.poster_path])

  const handleMouseMove = (e: React.MouseEvent) => {
    setPos({
      x: e.clientX,
      y: e.clientY
    })
  }
  console.log({movie})
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}?t=${Date.now()}`;
  return (
    <div 
        className={styles.movie}
        style={{
            height: `${imgHeight}px`,
            cursor: 'pointer'
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt={movie.original_name}
        crossOrigin="anonymous" 
        width={150}
        style={{ display: 'none' }}
        onLoad={(e) =>{
            const img = e.currentTarget
            setImgHeight(img.naturalHeight * (150 / img.naturalWidth))
        }}
      />
      <>{visible &&
        <BasicInfo pos={pos} title={movie.title} year={movie.release_date?.slice(0, 4) || ''} />
      }
      </>
      <canvas ref={canvasRef} style={{ width: '150px', imageRendering: 'pixelated' }} />
    </div>
  )
}
export default MovieItem


const BasicInfo = ({pos, title, year}: {pos: {x: number, y: number}, title: string, year: string}) =>{
    console.log(title, year);
    const content = (
        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                transform: `translate(${pos.x}px, ${pos.y}px) translate(15px, 15px)`,
                pointerEvents: 'none',
                zIndex: 1000,
                willChange: 'transform'
            }}
        >
            <p style={{ 
                    background: 'black', 
                    color: 'white', 
                    padding: '5px',
                    maxWidth: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                }}>{title} 
                <br/>
                {year.length > 0 && `(${year})`}
            </p>
        </div>
    );
    if (typeof document !== 'undefined') {
        return ReactDOM.createPortal(content, document.body);
    }
    
    return null;
}
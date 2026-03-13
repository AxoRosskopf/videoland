import { useCallback, useMemo, useRef, useState } from 'react'
import { pixelit} from '../../../../lib/pixelit'
import styles from './movie-item.module.css'
import ReactDOM from 'react-dom'; 

const MovieItem = ({ movie }: any) => {
  const [pos,setPos] = useState({x:0, y:0}) 
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const imageUrl = useMemo(() =>
    movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}?cors=true` : ''
  ,[movie?.poster_path])

  const triggerPixelit = (img : HTMLImageElement) => {
    const canvas = canvasRef.current
    if(!img || !canvas || img.naturalWidth === 0) return

    const height = img.naturalHeight * (150 / img.naturalWidth)
    canvas.style.height = `${height}px`
    const px = new pixelit({
      from: img,
      to: canvas,
      scale: 14,
      maxWidth: 150,
      maxHeight: height
    })

    px.draw().pixelate()
  }

  const setImgRef = useCallback((node : HTMLImageElement) =>{
    if(node){
      if(node.complete){
        triggerPixelit(node)
      }
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if(visible){
      setPos({
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  if(!movie || !movie.poster_path) return null;

  return (
    <a href={`https://vidsrc-embed.ru/embed/movie/${movie.id}`}>
    <div 
        className={styles.movie}
        style={{
            width: `150px`,
            cursor: 'pointer'
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={(e) =>{
          setPos({ x: e.clientX, y: e.clientY });
          setVisible(true)
        }}
        onMouseLeave={() => setVisible(false)}
    >
      <>{visible &&
        <BasicInfo pos={pos} title={movie.title} year={movie.release_date?.slice(0, 4) || ''} />
      }
      </>
      <img
        ref={setImgRef}
        src={imageUrl}
        alt={movie.title}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer" 
        width={150}
        style={{ display: 'none' }}
        onLoad={(e) => {triggerPixelit(e.currentTarget)}}
      />
      <canvas ref={canvasRef} width={150} style={{ width: '150px', imageRendering: 'pixelated', display: 'block' }} />
    </div>
    </a>
  )
}
export default MovieItem


const BasicInfo = ({pos, title, year}: {pos: {x: number, y: number}, title: string, year: string}) =>{
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
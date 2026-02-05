import { useEffect, useRef } from 'react'
import { pixelit} from '../../../../lib/pixelit'

const MovieItem = ({ movie }: any) => {
  if (!movie || !movie.poster_path) {
    return null;
  }
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
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}?t=${Date.now()}`;
  return (
    <div>
      <h3>{movie.original_name}</h3>
      <img
        ref={imgRef}
        src={imageUrl}
        alt={movie.original_name}
        crossOrigin="anonymous" 
        width={150}
        style={{ display: 'none' }}
      />
      <canvas ref={canvasRef} style={{ width: '150px', imageRendering: 'pixelated' }} />
    </div>
  )
}
export default MovieItem
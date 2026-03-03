import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useFetchData } from '../hooks/useFetchData'
import MovieItem from './MovieItem'
import useFetchSprite from '../hooks/use-fetch-sprite'
import styles from './movies.module.css'

const Movies = ({ title, actionLoading }: { title: string | null, actionLoading: Dispatch<SetStateAction<boolean>> }) => {
  if (!title) return null
  const[actualPage, setActualPage] = useState(0)
  const[totalPages, setTotalPages] = useState(0)
  const[pages, setPages] = useState<any[][]>([])
  const { sprite } = useFetchSprite('Arrow')
  const data = useFetchData(title)

  useEffect(()=>{
    if(!data) return;
    const newPages = [] 
    const filterData = data.results.filter((movie: any) => movie.poster_path !== null) 
    filterData.sort((a: any, b: any) => b.popularity - a.popularity);
    for(let i = 0; i < filterData.length; i+=5){
      newPages.push(filterData.slice(i, i + 5))
    }
    setPages(newPages)
    setActualPage(0)
    setTotalPages(Math.floor(filterData.length / 5));
    const timer = setTimeout(() => {
        actionLoading(false)
    }, 1000);
    return () => clearTimeout(timer);
  },[data])  

  if(pages.length === 0 ){ // Possible race condition
    return <div
      style={{
        color: 'white',
        fontSize: '1.5rem'
      }}
    >No movies found!</div>
  }

  const handlerNextPage = () =>{
    if(!data)return;
    console.log({actualPage, pages})
    if(actualPage <= totalPages - ( pages[totalPages - 1]?.length % 5 === 0 ? 2 : 1) ){
      setActualPage(prev => prev + 1)
    }
  }

  const handlerPreviousPage = () =>{
    if(!data)return;
    if(actualPage > 0){
      setActualPage(prev => prev -1)
    }
  }

  return (
     <div 
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        alignItems: 'center',
      }}
    >
      <button

        onClick={handlerPreviousPage}
        className={styles.previousButton}
        style={{
          opacity: actualPage === 0 ? 0.5 : 1
        }}
      >
        <div
          style={{
            backgroundImage: `url(${sprite?.getFramesData()[0]})`,
            width: `${sprite?.getWidth()}px`,
            height: `${sprite?.getHeight()}px`,
            imageRendering: 'pixelated'
          }}
        />
      </button>
      <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '2.5rem',
          alignItems: 'center',
      }}>
        {pages[actualPage]?.map(movie => (
          <MovieItem key={movie.id} movie={movie} />
        ))}
      </div>
      <button 
       onClick={handlerNextPage}
       className={styles.nextButton}
       style={{
         opacity: actualPage > totalPages - ( pages[totalPages - 1]?.length % 5 === 0 ? 2 : 1)  ? 0.5 : 1
       }}
      >
        <div
          style={{
            backgroundImage: `url(${sprite?.getFramesData()[0]})`,
            width: `${sprite?.getWidth()}px`,
            height: `${sprite?.getHeight()}px`,
            imageRendering: 'pixelated'
          }}
        />
      </button>
    </div>
  )
}

export default Movies

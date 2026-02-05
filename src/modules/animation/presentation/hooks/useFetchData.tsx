import { useEffect, useState } from "react";

type MovieCollection = {
  id: number
  original_name: string
  overview: string
  poster_path: string
}

type ApiResponse = {
  page: number
  results: MovieCollection[]
  total_pages: number
  total_results: number
}

export const useFetchData = (title : string) => {
    const [data, setData] = useState<ApiResponse | null>(null);
    useEffect(()=>{
        const fetchData = async() =>{
            try{
                const res = await fetch(`/api/movies/search?query=${encodeURIComponent(title.toLowerCase())}`);
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    },[title])
    return data;
}
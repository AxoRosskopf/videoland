import { useEffect, useState } from "react";

type MovieCollection = {
  id: number
  title: string
  overview: string
  poster_path: string
}

type ApiResponse = {
  results: MovieCollection[]
}

export const useFetchData = (title: string) => {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setData(null);
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/movies/search?query=${encodeURIComponent(title.toLowerCase())}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData({ results: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [title]);

    return { data, loading };
}
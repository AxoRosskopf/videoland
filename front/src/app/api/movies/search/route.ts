export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    if (!query) {
        return new Response('Query parameter is required', { status: 400 });
    }

    const backendRes = await fetch(`${process.env.BACKEND_URL}/hypo/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query }),
    });
    if (!backendRes.ok) {
        return new Response('Failed to fetch recommendations from backend', { status: backendRes.status });
    }
    const { recommendations } = await backendRes.json() as {
        recommendations: { id: number; title: string; plot: string; release_date: string | null }[];
    };

    const tmdbResults = await Promise.all(
        recommendations.map(async (movie) => {
            const year = movie.release_date?.split('-')[0];
            const params = new URLSearchParams({
                query: movie.title,
                include_adult: 'false',
                language: 'en-US',
                page: '1',
            });
            if (year) params.set('primary_release_year', year);

            const tmdbRes = await fetch(
                `https://api.themoviedb.org/3/search/movie?${params}`,
                {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                    },
                }
            );
            if (!tmdbRes.ok) return null;
            const data = await tmdbRes.json() as { results: unknown[] };
            return data.results[0] ?? null;
        })
    );

    const movies = tmdbResults.filter(Boolean);
    return new Response(JSON.stringify({ results: movies }), { status: 200 });
}


export async function GET(request: Request) {
    const url = 'https://api.themoviedb.org/3/authentication';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.API_KEY_TMDB}`
        }
    }
    const res = await fetch(url, options);
    if (!res.ok) {
        return new Response('Failed to fetch data from TMDB', { status: res.status });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}

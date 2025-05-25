import axios from 'axios'

export async function findAnimeMovie(title = 'Charlotte') {
    try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title.toLowerCase())}&limit=1`)
        const anime = res.data.data[0]
        if (anime) {
            const result = {
                title: anime.title,
                score: anime.score,
                status: anime.status,
                type: anime.type,
                year: anime.aired.prop.from.year,
                synopsis: anime.synopsis,
                url: anime.url,
                picture: anime.images.jpg.image_url,
            }
            return result
        } else {
            return `Anime Title : ${title} Not Found!`
        }
    } catch (error) {
        console.error(`Error Fetching on FindAnimeMovie : ${error}`)
    }
}

export async function recommendAnime(genre = 'romance', limit = 5) {
    try {
        const animeList = await axios.get(`https://api.jikan.moe/v4/genres/anime`)
        const genreObj = animeList.data.data.find(g => {
            return g.name.toLowerCase() === genre.toLowerCase();
        })
        if (!genreObj) return 'Genre Not Found'

        const genreId = genreObj.mal_id
        const res = await axios.get(`https://api.jikan.moe/v4/anime?genres=${genreId}&limit=${limit}&order_by=score&sort=desc`)
        const result = res.data.data.map(anime => ({
            title: anime.title,
            score: anime.score,
            url: anime.url,
            image: anime.images.jpg.image_url,
        }))
        return result
    } catch (error) {
        return `Failed Getting Information: ${error.message}`
    }
}
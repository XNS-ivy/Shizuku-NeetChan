import { recommendAnime } from "../../modules/axios/jikanAPI.js"

export default {
    name: 'recoanime',
    desc: 'Giving a recommendation anime list',
    premium: false,
    execute: async ({ args }) => {
        const limit = !isNaN(parseInt(args[1]))
            ? parseInt(args[1]) > 5
                ? 5
                : parseInt(args[1]) < 1
                    ? 1
                    : parseInt(args[1])
            : 3

        const payload = await recommendAnime(args[0], limit)

        const isArray = Array.isArray(payload)
        if (isArray) {
            const result = []

            for (let i = 0; i < payload.length; i++) {
                const anime = payload[i]
                result.push({
                    text: `*${anime.title}*\n⭐ Score: ${anime.score}\n🔗 ${anime.url}`,
                    url: anime.image,
                    type: 'image'
                })
            }

            return result
        } else {
            return {
                text: payload
            }
        }
    }
}
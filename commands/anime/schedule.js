import getAnimeShedule from "../../modules/axios/jikanAPI.js"

export default {
    name: 'anischedule',
    desc: 'Get anime schedule by day',
    premium: false,
    execute: async ({ args }) => {
        const payload = await getAnimeShedule(args.join(''))
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
import { findAnimeMovie } from "../../modules/axios/jikanAPI.js"

export default {
    name: "fanime",
    desc: 'finding anime movie',
    premium: false,
    execute: async ({ args }) => {
        const payload = await findAnimeMovie(args.join(' '))
        const content = `+ =========================\n\n` +
            `*Title*:\t${payload.title}\n` +
            `*Score*:\t${payload.score}\n` +
            `*Status*:\t${payload.status}\n` +
            `*Type*:\t${payload.type}\n\n` +
            `+ =========================\n\n` +
            `*Synopsis*:\t${payload.synopsis}\n\n` +
            `*URL*: ${payload.url}\n\n` +
            `+ =========================`
        if (payload.title) {
            return {
                text: content
            }
        } else {
            return {
                text: payload
            }
        }
    }
}
import { getGelbooruImage } from '../../modules/axios/gelbooruAPI.js'

export default {
    name: 'gelbooru',
    desc: 'Find image from gelbooru',
    execute: async ({ args }) => {
        const tag = args.join(' ') || '1girl'
        const result = await getGelbooruImage(tag)
        if (result?.url) return result
        else { return { text: result } }
    }
}
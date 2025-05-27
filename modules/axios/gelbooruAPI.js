import axios from 'axios'
import { parseStringPromise } from 'xml2js'

export async function getGelbooruImage(tag = 'waifu') {
  try {
    const { data } = await axios.get('https://gelbooru.com/index.php', {
      params: {
        page: 'dapi',
        s: 'post',
        q: 'index',
        limit: 20,
        tags: tag
      },
      timeout: 7000
    })

    const parsed = await parseStringPromise(data)
    let posts = parsed.posts?.post

    if (!posts || posts.length === 0) {
      return `🔍 Picture was not found with tag:  *${tag}*.`
    }

    const pick = posts[Math.floor(Math.random() * posts.length)]

    const fileUrl = pick.file_url?.[0]
    const source = pick.source?.[0] || 'Unknown'

    if (!fileUrl) {
      return `🔍 Picture was not found with file URL with tag *${tag}*.`
    }

    return {
      text: `🔍 Tag: *${tag}*\n🖼️ Source: ${source}`,
      url: fileUrl,
      type: 'image'
    }

  } catch (err) {
    console.error('Gelbooru XML Error:', err.message)
    return '❌ Failed get image from Gelbooru (XML).'
  }
}
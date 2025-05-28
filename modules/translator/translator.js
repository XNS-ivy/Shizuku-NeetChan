import translate from 'google-translate-api-x'

export async function translateText(text, target = 'en') {
  try {
    const res = await translate(text, { to: target })

    return {
      translated: res.text,
      from: res.from?.language?.iso || 'unknown',
      to: target
    }
  } catch (error) {
    console.error('Google Translate Error:', error.message)
    return null
  }
}
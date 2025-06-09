import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { downloadMediaMessage } from 'baileys'

export default {
  name: 'sticker',
  desc: 'Convert image to sticker',
  premium: false,
  execute: async ({ msg, sock }) => {
    try {
      const mediaMsg = msg.mediaUrl 
        ? msg.raw.message 
        : msg.raw.message?.extendedTextMessage?.contextInfo?.quotedMessage ?? null

      if (!mediaMsg) {
        return { text: 'Must contain an image or reply to an image message!' }
      }

      const mediaType = Object.keys(mediaMsg).find(
        (key) => key.endsWith('Message') && key !== 'senderKeyDistributionMessage'
      )

      if (!mediaType || mediaType === 'videoMessage') {
        return { text: '❌ Video not supported for sticker conversion!' }
      }

      const buffer = await downloadMediaMessage(
        { message: mediaMsg, key: msg.raw.key },
        'buffer',
        {},
        { logger: sock.logger, reuploadRequest: sock.updateMediaMessage }
      )

      const sticker = new Sticker(buffer, {
        pack: 'Shizuku',
        author: msg.name || '',
        type: StickerTypes.CROPPED,
        quality: 70,
      })

      const stickerBuffer = await sticker.toBuffer()

      return {
        type: 'sticker',
        buffer: stickerBuffer,
      }
    } catch (e) {
      console.error('Sticker error:', e)
      return { text: 'Failed to convert to sticker.' }
    }
  }
}
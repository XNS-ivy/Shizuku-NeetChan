import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { downloadMediaMessage } from 'baileys'

export default {
    name: 'sticker',
    desc: 'Convert image to sticker',
    premium: false,
    execute: async ({ msg, sock }) => {
        if (!msg.mediaUrl) return { text: 'Must Contains Picture!' }

        try {
            const buffer = await downloadMediaMessage(
                msg.raw,
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
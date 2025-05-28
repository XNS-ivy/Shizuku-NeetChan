export default {
    name: 'mentionall',
    desc: 'Mention all with specific groups',
    premium: true,
    execute: async ({ args, msg, sock }) => {
        const metadata = await sock.groupMetadata(msg.id)
        const participants = metadata.participants

        const role = args[0]?.toLowerCase()
        const filtered = participants.filter(p =>
            role === 'admin' ? p.admin !== null
            : role === 'member' ? p.admin === null
            : true
        )

        const mentions = filtered.map(p => p.id)
        const mentionText = mentions.map(jid => `@${jid.split('@')[0]}`).join(' ')
        const text = args.length > 1 ? args.slice(1).join(' ') : 'Hey guys!'

        return {
            text: `${text}\n\n${mentionText}`,
            mentions,
        }
    }
}
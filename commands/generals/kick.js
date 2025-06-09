export default {
    name: "kick",
    desc: "Kicking Members",
    premium: false,
    execute: async ({ sock, msg }) => {
        try {
            const groupId = msg.id
            const senderId = msg.phoneNumber + '@s.whatsapp.net'
            const metadata = await sock.groupMetadata(groupId)
            const participants = metadata.participants

            const senderIsAdmin = participants.some(p => p.id === senderId && p.admin)
            const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
            const botIsAdmin = participants.some(p => p.id === botId && p.admin)

            if (!senderIsAdmin) {
                return {
                    text: '❌ You are not an admin!',
                }
            }

            if (!botIsAdmin) {
                return {
                    text: '❌ Bot must be admin to perform this action.',
                }
            }

            const mentionedJids = msg.raw.message.extendedTextMessage?.contextInfo?.mentionedJid || []
            const nonAdminTargets = mentionedJids.filter(jid => {
                const target = participants.find(p => p.id === jid)
                return target && !target.admin
            })

            if (nonAdminTargets.length === 0) {
                return {
                    text: '⚠️ No members can be kicked out.',
                }
            }

            for (const target of nonAdminTargets) {
                await sock.groupParticipantsUpdate(groupId, [target], 'remove')
            }

            return {
                text: `✅ Kicked:\n${nonAdminTargets.map(j => '• @' + j.split('@')[0]).join('\n')}`,
                mentions: nonAdminTargets,
            }
        } catch (err) {
            console.error("Kick command error:", err)
            return {
                text: '❌ Uh oh, something went wrong.',
            }
        }
    }
}

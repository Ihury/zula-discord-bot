const Event = require('../../structures/Event')

const cooldowns = {}

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'interactionCreate'
        })
    }

    run = async (interaction) => {
        if (interaction.isCommand()) {
            if (!interaction.guild) return
            const cmd = this.client.commands.find(c => c.name === interaction.commandName)

            if (cmd.requireDatabase) interaction.guild.db = await this.client.db.guilds.findById(interaction.guild.id) || new this.client.db.guilds({ _id: interaction.guild.id })

            if (cmd) {
                // sistema de cooldown para o comando
                if (cmd.cooldown && !interaction.member.permissions.has('ADMINISTRATOR')) {
                    if (!cooldowns[interaction.commandName]) cooldowns[interaction.commandName] = {}
                    if (!cooldowns[interaction.commandName][interaction.user.id]) {
                        cooldowns[interaction.commandName][interaction.user.id] = Date.now() + cmd.cooldown
                        setTimeout(() => {
                            delete cooldowns[interaction.commandName][interaction.user.id]
                        }, cmd.cooldown)
                        cmd.run(interaction)
                    } else return this.client.errorReply(interaction, `Você poderá utilizar este comando em \`${formatTime(cooldowns[interaction.commandName][interaction.user.id] - Date.now())}\`.`)
                } else cmd.run(interaction)
            }
        } else if (interaction.isSelectMenu()) {
            if (interaction.customId === 'auto_role') {
                const guildDB = await this.client.db.guilds.findById(interaction.guild.id)
                if (!guildDB?.auto_role) return this.client.errorReply(interaction, 'Não há nenhum cargo definido para este servidor.')

                const roles = Object.values(guildDB.auto_role).map(r => interaction.guild.roles.cache.get(r.role)).filter(String)
                const rolesAdd = interaction.values
                const rolesRemove = roles.filter(r => !rolesAdd.includes(r.id))
                rolesAdd.forEach(r => {
                    if (!interaction.member.roles.cache.has(r.id)) interaction.member.roles.add(r)
                })
                rolesRemove.forEach(r => {
                    if (interaction.member.roles.cache.has(r.id)) interaction.member.roles.remove(r)
                })

                this.client.successReply(interaction, 'Cargos atualizados com sucesso.')
            }
        }
    }
}

// função que formata tempo
function formatTime(time) {
    let days = Math.floor(time / (1000 * 60 * 60 * 24))
    let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((time % (1000 * 60)) / 1000)

    return `${days > 0 ? `${days}d ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds > 0 ? `${seconds}s` : ''}`
}
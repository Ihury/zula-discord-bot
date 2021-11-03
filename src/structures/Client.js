require('dotenv').config();

const { Client, MessageEmbed } = require('discord.js')

const { readdirSync } = require('fs')
const { join } = require('path')

const Database = require('../database/database')

module.exports = class extends Client {
    constructor (options) {
        super({
            ...options,
            intents: 32767,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION']
        })

        this.commands = []
        this.db = new Database()
        this.loadCommands()
        this.loadEvents()        
    }

    registryCommands() {
        const guild = this.guilds.cache.get('903304505389617254')
        guild.commands.set(this.commands)
    }

    async configureCommandsPermissions() {
        const guild = this.guilds.cache.get('903304505389617254')
        const guildDB = await this.db.guilds.findById(guild.id)
        guild.commands.fetch().then(cmds => {
            this.commands.forEach(c => {
                if (c.permissions) {
                    const cmd = cmds.find(cm => cm.name === c.name)
                    guild.commands.permissions.set({
                        guild: guild.id,
                        command: cmd.id,
                        permissions: c.permissions.map(p => ({
                            ...p,
                            id: guildDB.cargos[p.id] || p.id
                        }))
                    })
                }
            })
        })
    }

    loadCommands(path = 'src/commands') {
        const categories = readdirSync(path)

        for (const category of categories) {
            const commands = readdirSync(`${path}/${category}`)

            for (const command of commands) {
                const commandClass = require(join(process.cwd(), `${path}/${category}/${command}`))
                const cmd = new (commandClass)(this)

                this.commands.push(cmd)
            }
        }
    }

    loadEvents(path = 'src/events') {
        const categories = readdirSync(path)

        for (const category of categories) {
            const events = readdirSync(`${path}/${category}`)

            for (const event of events) {
                const eventClass = require(join(process.cwd(), `${path}/${category}/${event}`))
                const evt = new (eventClass)(this)

                this.on(evt.name, evt.run)
            }
        } 
    }

    errorReply(interaction, message) {
        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Erro!')
            .setDescription(message)
            .setFooter(`${interaction.user.username}`, interaction.user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setTimestamp()
        
        interaction.reply({
            ephemeral: true,
            embeds: [embed]
        })
    }

    successReply(interaction, message) {
        const embed = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle('Sucesso!')
            .setDescription(message)
            .setFooter(`${interaction.user.username}`, interaction.user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setTimestamp()
        
        interaction.reply({
            ephemeral: true,
            embeds: [embed]
        })
    }
}
const { Client, Interaction, MessageEmbed, WebhookClient } = require('discord.js')
const { getNameCommand } = require('./GetNameCommands')

module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    makeLog: async function (client, interaction, args) {

        const webhookClient = new WebhookClient({ id: client.configs['webhook_id'], token: client.configs['webhook_token'] })
        var nameCommand = await getNameCommand(interaction)

        if (!interaction.isSelectMenu() && !interaction.isButton()) {
            if (!(interaction.options._subcommand === null)) {
                nameCommand = interaction.commandName + ' ' + nameCommand
            }
        }

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTimestamp()
            .setThumbnail(interaction.user.avatarURL())
            .addField('**Command**', `${nameCommand}`, false)
            .addField('**Server**', `${interaction.guild.name}`, true)
            .addField('**Server ID**', `${interaction.guild.id}`, true)
            .addField(`**Server Created At**`, `${interaction.guild.createdAt}`, false)
            .addField('**User**', `${interaction.user.tag}`, true)
            .addField('**User ID**', `${interaction.user.id}`, true)
            .addField(`**User Created At**`, `${interaction.user.createdAt}`, false)
            .addField('**Channel**', `${interaction.channel.name}`, true)
            .addField('**Channel ID**', `${interaction.channel.id}`, true)

        await webhookClient.send({
            username: `${client.user.username} Logs`,
            avatarURL: `${client.user.avatarURL()}`,
            embeds: [embed],
        })
    }
}
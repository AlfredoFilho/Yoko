const { Client, Interaction, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    ping: async function (client, interaction, args) {
        await interaction.reply({ content: `🏓Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`, ephemeral: false })
    },
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    stats: async function (client, interaction, args) {

        const embed = new MessageEmbed()
            .setDescription('\uFEFF')
            .setColor(interaction.user.colour)
            .setTimestamp()
            .addField('Bot Version', '3.0 - 11/Oct/2021', true)
            .addField('Node Version', '16.12.0', true)
            .addField('Discord.Js Version', '13.2.0', true)
            .setAuthor('Yoko - Stats', client.user.avatarURL())
            .setFooter(`${client.user.username}`)

        await interaction.reply({ embeds: [embed], ephemeral: false })
    },
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    purge: async function (client, interaction, args) {

        const member = interaction.member

        if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            const content = 'You are not allowed to use this command. Required permission: **Manage Messages**.'
            await interaction.reply({ content: content, ephemeral: true })
            return
        }

        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            const content = `I'm not allowed to use this command. Required permission: **Manage Messages**.`
            await interaction.reply({ content: content, ephemeral: true })
            return
        }

        var amount = interaction.options.getInteger('amount')

        if (amount < 1) {

            const content = `The quantity must be greater than 0.`
            await interaction.reply({ content: content, ephemeral: true })
            return

        } else {

            await interaction.deferReply()

            amount = amount + 1

            if (amount > 100) { amount = 100 }

            await interaction.channel.messages
                .fetch({ limit: amount })
                .then((messages) => {

                    if (messages.size === 0) {
                        const content = `I couldn't find messages to delete. A bot can only delete messages up to 14 days ago.`
                        interaction.editReply({ content: content, ephemeral: false })
                        return
                    }

                    interaction.channel.bulkDelete(messages)
                })
        }

    }
}
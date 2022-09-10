const { Client, Interaction, MessageActionRow, MessageSelectMenu } = require('discord.js')

class Startping {

    constructor(channel, user, text) {
        this.timer = null
        this.channel = channel
        this.user = user
        this.text = text
    }

    myLoop() {
        var self = this

        this.timer = setTimeout(function () {
            try {
                self.channel.send(`<@${self.user.id}> ${self.text}`)
                self.myLoop()
            } catch (e) {
                console.log(e)
            }
        }, 20000)
    }

    start() {
        this.myLoop()
    }

    cancel() {
        clearTimeout(this.timer)
    }
}

module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    startping: async function (client, interaction, args) {

        async function checkWhoIs(user) {

            if (user.bot) {
                const content = `Command available to members only. **${user.username}** is a bot.`
                await interaction.reply({ content: content, ephemeral: true })
                return true
            }

            else if (user.id === interaction.user.id) {
                const content = `You cannot use this command for yourself.`
                await interaction.reply({ content: content, ephemeral: true })
                return true
            }

            else {
                return false
            }
        }

        async function checkAlreadyCreateForUser(channelId, user) {

            if (channelId in client.startping) {
                for (position in client.startping[channelId]) {
                    if (user.id in client.startping[channelId][position]) {
                        const content = 'It has already been created for that person on this channel.'
                        await interaction.reply({ content: content, ephemeral: true })
                        return true
                    }
                }
            }

            else {
                return false
            }
        }

        async function run(channel, channelId, user, text) {

            const content = 'Startping started. To disable use **/endping**'
            st = new Startping(channel, user, text)

            newEntrie = {}
            newEntrie[user.id] = st

            if (cId in client.startping) {
                client.startping[channelId].push(newEntrie)

            } else {
                client.startping[channelId] = []
                client.startping[channelId].push(newEntrie)
            }

            st.start()
            await interaction.reply({ content: content, ephemeral: false })
        }

        if (interaction.isContextMenu()) {

            let text = ''
            const user = await client.users.fetch(interaction.targetId)

            if (await checkWhoIs(user) || await checkAlreadyCreateForUser(interaction.channelId, user)) {
                return
            }

            var cId = interaction.channelId
            var c = client.channels.cache.get(cId)

            await run(c, cId, user, text)
            return
        }

        var cId = interaction.channelId
        var c = client.channels.cache.get(cId)
        var user = interaction.options.getUser('user')
        var text = interaction.options.getString('text')

        if (await checkWhoIs(user) || await checkAlreadyCreateForUser(cId, user)) {
            return
        }

        await run(c, cId, user, text)
    },

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    endping: async function (client, interaction, args) {

        var cId = interaction.channelId

        async function disableStartping() {

            const userId = interaction.values[0]

            if (interaction.user.id === userId) {
                const content = `${interaction.user.username}, you cannot disable it for yourself :triumph:`
                await interaction.update({ content: content, components: [] })
                return
            }

            for (positionDict in client.startping[cId]) {
                var contain = Object.keys(client.startping[cId][positionDict]).indexOf(userId) > -1

                if (contain) {
                    client.startping[cId][positionDict][userId].cancel()
                    user = await client.users.cache.get(userId)

                    client.startping[cId].splice(positionDict, 1)

                    const content = `Disabled for ${user.username}.`
                    await interaction.update({ content: content, components: [] })
                    return
                }
            }

            const content = `Has already been disabled for this user`
            await interaction.update({ content: content, components: [] })
            return
        }

        if (interaction.isSelectMenu()) {
            await disableStartping()
            return
        }

        if (!client.startping[cId]) {
            const content = `There is no **/startping** running on this channel.`
            await interaction.reply({ content: content, ephemeral: false })
            return
        }

        if (client.startping[cId]) {
            if (!client.startping[cId].length > 0) {
                const content = `There is no **/startping** running on this channel.`
                await interaction.reply({ content: content, ephemeral: false })
                return
            }
        }

        var listOptions = []
        client.listInstancesStarping = []

        for (dict in client.startping[cId]) {

            users = Object.keys(client.startping[cId][dict])

            for (position in users) {

                var userId = users[position]
                user = await client.users.cache.get(userId)

                var option = {
                    label: user.username,
                    value: userId,
                }
                listOptions.push(option)
            }
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Options')
                    .addOptions(listOptions),
            )

        await interaction.reply({ content: 'Select someone!', components: [row] })
    },
}
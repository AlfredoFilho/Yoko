const { Client, Interaction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const axios = require('axios')

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        }
    )
}

module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    rps: async function (client, interaction, args) {

        const embed = new MessageEmbed()
            .setThumbnail('https://i.imgur.com/IatSCe8.png')
            .setColor('#FFFFFF')
            .setDescription('Choose one')

        if (interaction.isButton()) {
            const userChoice = interaction.customId
            const listRps = ['rock', 'paper', 'scissors']
            const botRandomChoice = listRps[Math.floor(Math.random() * listRps.length)]

            embed.addField(interaction.user.username, toTitleCase(userChoice), true)
            embed.addField(client.user.username, toTitleCase(botRandomChoice), true)

            dictGetResult = {
                'scissors-paper': 1,
                'rock-scissors': 1,
                'paper-rock': 1,
                'paper-scissors': 0,
                'scissors-rock': 0,
                'rock-paper': 0
            }

            const resultGame = dictGetResult[botRandomChoice + '-' + userChoice]

            if (userChoice === botRandomChoice) {
                embed.addField('Result', 'Tie!', false)
                embed.setColor('#00A4FF')
            }
            else if (resultGame === 1) {
                embed.addField('Result', 'Lose!', false)
                embed.setColor('#FF0000')
            }
            else {
                embed.addField('Result', 'Win!', false)
                embed.setColor('#23C423')
            }

            embed.setAuthor('Rock - Paper - Scissors', interaction.user.avatarURL())
            embed.setTimestamp()

            await interaction.update({ embeds: [embed], components: [] })
        }

        else {

            embed.setTitle('Rock - Paper - Scissors')
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel('Rock')
                        .setStyle('DANGER')
                        .setCustomId('rock')
                        .setEmoji('🪨'),
                    new MessageButton()
                        .setLabel('Paper')
                        .setStyle('SUCCESS')
                        .setCustomId('paper')
                        .setEmoji('📝'),
                    new MessageButton()
                        .setLabel('Scissors')
                        .setStyle('PRIMARY')
                        .setCustomId('scissors')
                        .setEmoji('✂️'),
                )

            await interaction.reply({ embeds: [embed], components: [row], ephemeral: false })
        }
    },

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    hotcalc: async function (client, interaction, args) {
        const user = interaction.options.getUser('user')

        const r = randomIntFromInterval(1, 100)
        const hot = r / 1.17

        var emoji

        if (hot > 75) { emoji = '💞' }
        if (hot > 50) { emoji = '💖' }
        if (hot > 25) { emoji = '❤' }
        else { emoji = '💔' }

        const content = `**${user.username}** is **${hot.toString().substr(0, 4)}%** hot ${emoji}`

        await interaction.reply({ content: content, ephemeral: false })
    },

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    rate: async function (client, interaction, args) {

        const text = interaction.options.getString('text')
        const thing = '`' + text + '`'

        const content = `I'd rate ${thing} a **${randomIntFromInterval(0, 100)} / 100**`
        await interaction.reply({ content: content, ephemeral: false })
    },

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    coinflip: async function (client, interaction, args) {
        const coinsides = ['Heads', 'Tails']
        const content = `**${interaction.user.username}** flipped a coin and got **${coinsides[Math.floor(Math.random() * coinsides.length)]}**!`
        await interaction.reply({ content: content, ephemeral: false })
    },

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    coffe: async function (client, interaction, args) {
        axios.get('https://coffee.alexflipnote.dev/random.json')
            .then(response => {
                interaction.reply({ content: response.data.file, ephemeral: false })
            })
            .catch(error => {
                interaction.reply({ content: `The [API](<https://coffee.alexflipnote.dev/random.json>) returned an error or didn't return JSON...`, ephemeral: false })
            })
    },

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    slot: async function (client, interaction, args) {
        const emojis = ['🍎', '🍊', '🍐', '🍋', '🍉', '🍇', '🍓', '🍒']

        const a = emojis[Math.floor(Math.random() * emojis.length)]
        const b = emojis[Math.floor(Math.random() * emojis.length)]
        const c = emojis[Math.floor(Math.random() * emojis.length)]

        slotmachine = `**[ ${a} ${b} ${c} ]\n${interaction.user.username}**,`

        if (a == b == c) {
            const content = `${slotmachine} All matching, you won! 🎉`
            await interaction.reply({ content: content, ephemeral: false })
        }
        if ((a == b) || (a == c) || (b == c)) {
            const content = `${slotmachine} 2 in a row, you won! 🎉`
            await interaction.reply({ content: content, ephemeral: false })
        }
        else {
            const content = `${slotmachine} No match, you lost 😢`
            await interaction.reply({ content: content, ephemeral: false })
        }

    },

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    duck: async function (client, interaction, args) {

        axios.get('https://random-d.uk/api/v1/random')
            .then(response => {
                interaction.reply({ content: response.data.url, ephemeral: false })
            })
            .catch(error => {
                interaction.reply({ content: `The [API](<https://random-d.uk/api/v1/random>) returned an error or didn't return JSON...`, ephemeral: false })
            })
    },

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    eightball: async function (client, interaction, args) {

        const ballresponse = [
            'Yes', 'No', 'Take a wild guess...', 'Very doubtful',
            'Sure', 'Without a doubt', 'Most likely', 'Might be possible',
            `You'll be the judge`, 'no... (╯°□°）╯︵ ┻━┻', 'no... baka',
            'senpai, pls no ;-;'
        ]

        const answer = ballresponse[Math.floor(Math.random() * ballresponse.length)]
        const messageLink = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.targetId}`

        if (interaction.isContextMenu()) {

            interaction.channel.messages.fetch(interaction.targetId).then(message => {

                if (message.author.bot) {
                    const content = `The author of [this message](<${messageLink}>) is a bot, command not available.`
                    interaction.reply({ content: content, ephemeral: false })

                } else {
                    if (message.content) {
                        const content = `🎱 [Question](<${messageLink}>): ${message.content}\n**Answer:** ${answer}`
                        interaction.reply({ content: content, ephemeral: false })

                    } else {
                        const content = `The content of [this message](<${messageLink}>) is empty.`
                        interaction.reply({ content: content, ephemeral: false })

                    }

                }
            })
        } else {
            const question = interaction.options.getString('question')
            const content = `🎱 **Question:** ${question}\n**Answer:** ${answer}`
            await interaction.reply({ content: content, ephemeral: false })
        }
    },

    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {*} args
     */

    reverse: async function (client, interaction, args) {

        const messageLink = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.targetId}`

        function reverse(s) {
            return s.split('').reverse().join('')
        }

        if (interaction.isContextMenu()) {

            interaction.channel.messages.fetch(interaction.targetId).then(message => {

                if (message.author.bot) {
                    const content = `The author of [this message](<${messageLink}>) is a bot, command not available.`
                    interaction.reply({ content: content, ephemeral: false })

                } else {
                    if (message.content) {
                        const reversedText = reverse(message.content)
                        interaction.reply({ content: `${reversedText}`, ephemeral: false })
                    } else {
                        const lastMessageLink = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.targetId}`
                        interaction.reply({ content: `The content of [this message](<${lastMessageLink}>) is empty. The Reverse command returns the message content reversed.`, ephemeral: false })
                    }
                }
            })


        } else {

            const text = interaction.options.getString('text')
            const reversedText = reverse(text)
            await interaction.reply({ content: `${reversedText}`, ephemeral: false })

        }
    }
}
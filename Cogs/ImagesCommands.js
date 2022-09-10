const { Client, Interaction, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, Permissions } = require('discord.js')
const Jimp = require('jimp')
const fs = require('fs')

const wait = require('util').promisify(setTimeout)


async function getMessageToAnalyze(interaction) {

    var messageToAnalyze

    await interaction.channel.messages.fetch(interaction.targetId).then(message => {
        messageToAnalyze = message
    })

    return messageToAnalyze
}

function deleteFile(pathJPG) {
    try {
        fs.unlinkSync(pathJPG)
        //file removed
    } catch (err) {
        console.error(err)
    }
}

module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    tojpg: async function (client, interaction, args) {

        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.ATTACH_FILES)) {
            const content = `I'm not allowed to use this command. Required permission: **Attach Files**.`
            await interaction.reply({ content: content, ephemeral: true })
            return
        }

        await interaction.deferReply()

        var messageToAnalyze = await getMessageToAnalyze(interaction)

        const messageToAnalyzeLink = `https://discord.com/channels/${messageToAnalyze.guildId}/${messageToAnalyze.channelId}/${messageToAnalyze.id}`

        if (messageToAnalyze.attachments.size > 0) {

            var nameAttachment
            var attachmentExtension
            var urlAttachment

            messageToAnalyze.attachments.forEach(messageAttachment => {
                nameAttachment = messageAttachment.name.substr(0, messageAttachment.name.length - 4)
                attachmentExtension = messageAttachment.name.substr(-4)
                urlAttachment = messageAttachment.url
            })

            if (attachmentExtension === '.png') {

                const pathJPG = './tmp/' + nameAttachment + '.jpg'

                const readImage = await Jimp.read(urlAttachment)
                readImage.writeAsync(pathJPG)

                await wait(500)

                const file = new MessageAttachment(pathJPG)
                const embed = new MessageEmbed()
                    .setTitle('Image in JPG')
                    .setDescription(`Old image [here](${messageToAnalyzeLink})`)
                    .setThumbnail(`attachment://${nameAttachment}.jpg`)
                    .setTimestamp()

                const response = await interaction.editReply({ embeds: [embed], files: [file], ephemeral: false })
                deleteFile(pathJPG)

                // Send a button with image url
                response.reactions.message.embeds.forEach(value => {

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel('Open')
                                .setStyle('LINK')
                                .setURL(value.thumbnail.url),
                        )

                    client.channels.cache.get(response.channelId).send({ content: 'Image url', components: [row] })
                })

            } else {
                const content = `[Your attachment](<${messageToAnalyzeLink}>) does not have a **.png** extension. /tojpg command convert PNG to JPG.`
                await interaction.editReply({ content: content, ephemeral: false })
            }

        } else {
            const content = `I didn't find an attachment in [this message](<${messageToAnalyzeLink}>).`
            await interaction.editReply({ content: content, ephemeral: false })
        }

    }
}
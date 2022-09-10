const { Client, Interaction, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')

const embedAnimelist = new MessageEmbed()
    .setTitle('**Help - Animelist**')
    .setThumbnail('https://i.imgur.com/xR7MZcj.jpg')
    .setColor('#FF0059')
    .setTimestamp()
    .setDescription('Bot chooses a random anime or manga from the list on Anilist')
    .addField('**How to use:**', '```/anilist <user> <type> <status>```', false)
    .addField('**Example:**', '```/anilist Bayon anime planning```', false)

const embedCopypasta = new MessageEmbed()
    .setTitle('**Help - Copypasta**')
    .setThumbnail('https://i.imgur.com/xR7MZcj.jpg')
    .setColor('#FF0059')
    .setTimestamp()
    .setDescription('Commands copypastas')
    .addField('**List of copypastas available**', '```/copypastas list```', false)
    .addField('**Send a copypasta**', '```/copypastas send <name_copypasta>```', false)
    .addField('**Add an copypasta**', '```/copypastas add <name_copypasta> <text>```', false)
    .addField('**Delete a copypasta you added**', '```/copypastas delete <name_copypasta>```', false)
    .addField('**Warning**', '`Copypastas are public, on any server you can use`')

const embedImages = new MessageEmbed()
    .setTitle('**Help - Images**')
    .setThumbnail('https://i.imgur.com/xR7MZcj.jpg')
    .setColor('#FF0059')
    .setTimestamp()
    .setDescription('Image manipulation commands')
    .addField('**PNG to JPG**', 'Right click on message > **Apps** > **Image to JPG**.\n[**Example**](https://i.imgur.com/A2HR3sa.png)')

const embedGames = new MessageEmbed()
    .setTitle('**Help - Games**')
    .setThumbnail('https://i.imgur.com/xR7MZcj.jpg')
    .setColor('#FF0059')
    .setTimestamp()
    .setDescription('Some games')
    .addField('**Coinflip!**', '```/games coinflip```', true)
    .addField('**Rock Paper Scissors**', '```/games rps```', true)
    .addField('**Random Duck**', '```/games duck```', true)
    .addField('**Random Coffe**', '```/games coffe```', true)
    .addField('**Roll the slot machine**', '```/games slot```', true)
    .addField('**Reverse your message**', '```/games reverse <text>```Or [**Message Context Menu**](https://i.imgur.com/e7XGeOI.png)', false)
    .addField('**8ball - I answer for you**', '```/games eightball <question>```Or [**Message Context Menu**](https://i.imgur.com/4WGmQur.png)', false)
    .addField('**Rates what you desire**', '```/games rate <text>```', false)
    .addField('**Returns a random percent for how hot is a discord user**', '```/games hotcalc <user>```', false)

const embedOthers = new MessageEmbed()
    .setTitle('**Help - Others**')
    .setThumbnail('https://i.imgur.com/xR7MZcj.jpg')
    .setColor('#FF0059')
    .setTimestamp()
    .setDescription('Other commands')
    .addField('**Ping a user every 30sg**', '```/startping <user> <text>```Or [**User Context Menu**](https://i.imgur.com/x0lLZP5.png)', false)
    .addField('**Delete messages**', '```/purge <amount>```', false)
    .addField('**Latency bot**', '```/ping```', true)
    .addField('**Some info about the bot**', '```/stats```', true)

var listOptionsSelectMenu = [
    {
        label: 'Home',
        value: 'help_home',
        emoji: '903757460395921478'
    },
    {
        label: 'AnimeList',
        value: 'help_animelist',
        emoji: '892147824660189184'
    },
    {
        label: 'Copypastas',
        value: 'help_copypastas',
        emoji: '894614814456954900'
    },
    {
        label: 'Images',
        value: 'help_images',
        emoji: '892160355567038524'
    },
    {
        label: 'Games',
        value: 'help_games',
        emoji: '892159932995108924'
    },
    {
        label: 'Others',
        value: 'help_others',
        emoji: '892175186122649662'
    }
]

module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    help: async function (client, interaction, args) {

        const serverName = '`' + interaction.guild.name + '`'

        const embedHelp = new MessageEmbed()
            .setTitle('**Hey!**')
            .setDescription(`Server: ${serverName}`)
            .setThumbnail('https://i.imgur.com/xR7MZcj.jpg')
            .setColor('#FF0059')
            .addField('**<:ModulesEmoji:892131485132402709> Modules**:', `
            > ┠ Animelist
            > ┠ Copypasta
            > ┠ Images
            > ┠ Games
            > ┠ Others`, true)
            .addField('**<:LinkEmoji:892131991636541451> Link!:**', `[Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot)`, true)
            .addField('<:GlobeEmoji:892174454388588657> **Vote!**', `[Link](https://top.gg/bot/${client.user.id}/vote)`, false)

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Options')
                    .addOptions(listOptionsSelectMenu),
            )

        if (interaction.isSelectMenu()) {

            dictGetEmbed = {
                'help_home': embedHelp,
                'help_animelist': embedAnimelist,
                'help_copypastas': embedCopypasta,
                'help_images': embedImages,
                'help_games': embedGames,
                'help_others': embedOthers
            }

            const value = interaction.values[0]
            const embed = dictGetEmbed[value]
            await interaction.update({ embeds: [embed], components: [row], ephemeral: false })
            return
        }

        await interaction.reply({ embeds: [embedHelp], components: [row], ephemeral: false })
    }
}
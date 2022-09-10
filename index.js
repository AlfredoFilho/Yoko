const { Client, Intents } = require('discord.js')
const allIntents = new Intents(32767)
const client = new Client({ intents: allIntents })
const fs = require('fs')
client.configs = require('./configs.json')

const { AutoPoster } = require('topgg-autoposter')
const ap = AutoPoster(client.configs['topgg_token'], client)
var post = false
ap.on('posted', () => {
    if (!post) {
        console.log('Posted stats to Top.gg!')
        post = true
    }
})

const copypastascommands = require('./Cogs/CopypastasCommands')
const animelistcommands = require('./Cogs/AnimelistCommands')
const startpingcommand = require('./Cogs/StartpingCommand')
const imagescommands = require('./Cogs/ImagesCommands')
const othersCommands = require('./Cogs/OthersCommands')
const gamescommands = require('./Cogs/GamesCommands')
const helpcommands = require('./Cogs/HelpCommands')

const { RegisterSlashCommands } = require('./register-commands')
const { getNameCommand } = require('./Cogs/GetNameCommands')
const { makeLog } = require('./Cogs/WebhookLogs')

const allCogsCommands = [
    copypastascommands,
    startpingcommand,
    animelistcommands,
    imagescommands,
    othersCommands,
    gamescommands,
    helpcommands,
]

// Create tmp folder if not exists
fs.mkdir('./tmp/', { recursive: true }, (err) => {
    if (err) throw err
})

function randomChoice(myArray){
    return myArray[Math.floor(Math.random()*myArray.length)]
}

client.startping = {}
client.raizRunning = false

client.on('ready', async () => {

    console.log(`${client.user.tag} is online\n`)

    var arrayStatus = [
        "online",
        "dnd",
    ];

    var arrayTypePresence = [
        "WATCHING",
        "PLAYING",
    ];

    var arrayNamePresence = [
        "/help - Give application.commands permission for the bot to work properly",
        "/games - Give application.commands permission for the bot to work properly",
        "/purge - Give application.commands permission for the bot to work properly",
    ];

    setInterval(function () {
        client.user.setStatus(randomChoice(arrayStatus))
        client.user.setPresence({
            activities: [{
                name: randomChoice(arrayNamePresence),
                type: randomChoice(arrayTypePresence)
            }]
        })
    }, 300000);

    client.guilds.cache.map(guild => {
        const owner = client.users.cache.get(guild.ownerId)
        console.log(`Guild: ${guild.id} - ${guild.name}\n    Owner ${guild.ownerId}`)
    })

    // if guild_id is empty, it will be loaded globally.
    // RegisterSlashCommands(client_id = client.user.id, guild_id = '')
    // RegisterSlashCommands(client_id = client.user.id, guild_id = '552606151775223828')

    // To clear slash commands in specific guild
    // await client.guilds.cache.get('552606151775223828').commands.set([])
    // To clear slash commands in all guilds
    // await client.application.commands.set([])
})

client.on('messageCreate', async message => {
    if (String(message.author.id) === '528210231272931338') {
        if (String(message.content).includes('yokoleave')) {
            var id = String(message.content).split(" ")[1]
            await client.guilds.cache.get(id).leave()
        }
    }
})

client.on("guildCreate", guild => {
    console.log('--------------------------')
    console.log("Joined a new guild: " + guild.name)
    console.log('--------------------------')
    //ban a guild
    // if (String(guild.id) === 'guild_id') {
    //     guild.leave()
    // }
})

client.on('interactionCreate', async interaction => {

    if (interaction.guild === null) {
        await interaction.reply({ content: 'Commands are only available to guilds.' })
        return
    }

    const nameCommand = await getNameCommand(interaction)

    for (cogcommands in allCogsCommands) {
        if (nameCommand in allCogsCommands[cogcommands]) {

            await allCogsCommands[cogcommands][nameCommand](client, interaction)
        }
    }
    await makeLog(client, interaction)
})

client.login(client.configs['token'])
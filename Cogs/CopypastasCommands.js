const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')
const { Client, Interaction, MessageEmbed } = require('discord.js')

class raizClass {

    constructor(client, channel, text) {
        this.client = client
        this.timer = null
        this.channel = channel
        this.text = text
    }

    myLoop() {
        var self = this
        const textSize = self.text.length

        var count = 0
        var count2 = 2000

        this.timer = setTimeout(function () {
            for (var i = 0; i < Math.ceil(textSize / 2000); i++) {
                try {
                    self.channel.send({ content: self.text.slice(count, count2) })
                } catch (e) {
                    console.log(e)
                }
                count += 2000
                count2 += 2000
            }
            self.channel.send({
                content: `
-----------------------------------------------------
** Raíz quadrada de 2 com 10 milhões de digitos**
-----------------------------------------------------
https://i.imgur.com/dzMDcbv.gif
            ` })
        self.cancel()
        }, Infinity)


    }

    start() {
        this.myLoop()
    }
    cancel() {
        clearTimeout(this.timer)
    }
}

async function getData() {

    listWithDictData = []

    return new Promise((resolve, reject) => {
        fs.createReadStream(path.resolve(__dirname, '../files', 'DataCopypast.csv'))
            .pipe(csv.parse({ headers: true }))
            .on('error', error => reject(error))
            .on('data', row => {
                entrie = {}
                entrie['nameCP'] = row.nameCP
                entrie['textCP'] = row.textCP
                entrie['userWhoAdded'] = row.userWhoAdded
                listWithDictData.push(entrie)
            })
            .on('end', function () {
                return resolve(listWithDictData)
            })
    })
}

async function sendCopypasta(client, channelId, textCP) {

    const textSize = textCP.length
    const channel = client.channels.cache.get(channelId)

    if (textSize > 2000) {

        var count = 0
        var count2 = 2000

        for (var i = 0; i < Math.ceil(textSize / 2000); i++) {
            try {
                await channel.send({ content: textCP.slice(count, count2) })
            } catch (e) {
                console.log(e)
            }
            count += 2000
            count2 += 2000
        }

    } else {
        try {
            await channel.send({ content: textCP })
        } catch (e) {
            console.log(e)
        }
    }
}


module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    add: async function (client, interaction, args) {

        await interaction.deferReply()

        const nameCP = interaction.options.getString('name').slice(0, 50)
        const nameCPinBase64 = Buffer.from(nameCP).toString('base64')
        const textCP = interaction.options.getString('text')
        const userWhoAdded = interaction.user.id

        const listWithDictData = await getData()
        var arrayContainsNameCP = false

        for (position in listWithDictData) {

            const dict = listWithDictData[position]

            if (nameCPinBase64 === dict['nameCP']) {
                arrayContainsNameCP = true
            }
        }

        if (arrayContainsNameCP) {

            const content = `This name for copypasta has already been used. Please use another name.`
            await interaction.editReply({ content: content, ephemeral: false })
            return

        } else {

            const textCPinBase64 = Buffer.from(textCP).toString('base64')

            var newEntrie = {}
            newEntrie['nameCP'] = nameCPinBase64
            newEntrie['textCP'] = textCPinBase64
            newEntrie['userWhoAdded'] = userWhoAdded

            var data = []

            await new Promise((resolve, reject) => {
                fs.createReadStream(path.resolve(__dirname, '../files', 'DataCopypast.csv'))
                    .pipe(csv.parse({ headers: true }))
                    .on('error', error => reject(error))
                    .on('data', row => {
                        let entrie = {}
                        entrie['nameCP'] = row.nameCP
                        entrie['textCP'] = row.textCP
                        entrie['userWhoAdded'] = row.userWhoAdded
                        data.push(entrie)
                    })
                    .on('end', function () {
                        resolve()
                    })
            })

            data.push(newEntrie)

            const ws = fs.createWriteStream("./files/DataCopypast.csv")
            csv.write(data, { headers: true })
                .pipe(ws)

            const content = `Copypasta **${nameCP}** added.`
            await interaction.editReply({ content: content, ephemeral: false })
        }
    },

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    list: async function (client, interaction, args) {

        await interaction.deferReply()

        var listWithDictData = await getData()
        listWithDictData = listWithDictData.sort((a, b) => (a.nameCP > b.nameCP) ? 1 : -1)

        var listEmbeds = [new MessageEmbed()]
        var count = 1

        for (position in listWithDictData) {

            count += 1

            const dict = listWithDictData[position]

            const nameCPinBase64 = dict['nameCP']
            const nameCP = Buffer.from(nameCPinBase64, 'base64').toString('utf8')
            const textCPinBase64 = dict['textCP']
            const textCP = Buffer.from(textCPinBase64, 'base64').toString('utf8')

            listEmbeds[listEmbeds.length - 1].addField('**' + nameCP.slice(0, 50) + '**', textCP.slice(0, 15) + '...', true)

            if (count === 25) {
                listEmbeds.push(new MessageEmbed())
                count = 1
            }
        }

        const content = `Available copypastas:`
        const channel = client.channels.cache.get(interaction.channel.id)

        await interaction.editReply({ content: content, ephemeral: false })

        for (position in listEmbeds) {
            channel.send({ embeds: [listEmbeds[position]] })
        }
    },

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    send: async function (client, interaction, args) {

        await interaction.deferReply({ ephemeral: true })

        const nameCP = interaction.options.getString('name')
        const nameCPinBase64 = Buffer.from(nameCP).toString('base64')

        const listWithDictData = await getData()

        for (position in listWithDictData) {

            const dict = listWithDictData[position]
            const textCPinBase64 = dict['textCP']
            const textCP = Buffer.from(textCPinBase64, 'base64').toString('utf8')

            if (nameCPinBase64 === dict['nameCP']) {
                const content = `Copypasta sent`

                await sendCopypasta(client, interaction.channel.id, textCP)

                await interaction.editReply({ content: content, ephemeral: true })
                return
            }
        }
        
        const content = `Copypasta **${nameCP}** does not exist. To see the available copypastas, use **/copypastas list**`
        await interaction.editReply({ content: content, ephemeral: true })
    },

    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {*} args
     */

    delete: async function (client, interaction, args) {

        await interaction.deferReply()

        const nameCP = interaction.options.getString('name')
        const nameCPinBase64 = Buffer.from(nameCP).toString('base64')
        const userId = interaction.user.id
        var copypastasFromUser = []
        var listWithDictData = await getData()
        var containInData = false

        for (var position in listWithDictData) {

            const dict = listWithDictData[position]

            if (userId === dict['userWhoAdded']) {
                copypastasFromUser.push(dict)
            }

            if (nameCPinBase64 === dict['nameCP']) {
                containInData = true
                var positionData = position
            }
        }

        if (!containInData) {
            const content = `Copypasta **${nameCP}** does not exist. To see the available copypastas, use **/copypastas list**`
            await interaction.editReply({ content: content, ephemeral: false })
            return
        }

        var containNameCPforDelete = false
        var nameCPCopypastasFromUser = []

        for (position in copypastasFromUser) {

            const dict = copypastasFromUser[position]

            nameCPCopypastasFromUser.push(dict['nameCP'])

            if (nameCPinBase64 === dict['nameCP']) {
                containNameCPforDelete = true
            }
        }

        if (containNameCPforDelete) {

            listWithDictData.splice(positionData, 1)

            const ws = fs.createWriteStream("./files/DataCopypast.csv")
            csv.write(listWithDictData, { headers: true })
                .pipe(ws)

            const content = `Deleted copypasta **${nameCP}**.`
            await interaction.editReply({ content: content, ephemeral: false })

        } else {
            const content = `Copypasta **${nameCP}** was not added by you. The ones you added are: ${nameCPCopypastasFromUser.join(', ')}`
            await interaction.editReply({ content: content, ephemeral: false })
        }
    }
}
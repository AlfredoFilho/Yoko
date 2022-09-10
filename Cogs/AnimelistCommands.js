const { Client, Interaction, MessageEmbed } = require('discord.js')
const axios = require('axios')

const queryManga = `
query ($username: String, $type: MediaType, $status: MediaListStatus) {
    MediaListCollection(userName: $username, type: $type, status : $status) {
        user{
            avatar {
                large
            }
        }
        lists {
            entries {
                status
                media {
                    siteUrl
                    status
                    volumes
                    chapters
                    meanScore
                    genres
                    startDate {
                        year
                    }
                    title {
                        romaji
                    }
                    coverImage {
                        extraLarge
                    }
                }
            }
        }
    }
}
`

const queryAnime = `
query ($username: String, $type: MediaType, $status: MediaListStatus) {
    MediaListCollection(userName: $username, type: $type, status : $status) {
        user{
            avatar {
                large
            }
        }
        lists {
            entries {
                status
                media {
                    siteUrl
                    episodes
                    genres
                    meanScore
                    seasonYear
                    title {
                        romaji
                    }
                    coverImage {
                        extraLarge
                    }
                }
            }
        }
    }
}
`

function isNumeric(value) {
    return /^-?\d+$/.test(value)
}


module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    anilist: async function (client, interaction, args) {

        await interaction.deferReply()

        const username = interaction.options.getString('user')
        const type = interaction.options.getString('media')
        const status = interaction.options.getString('status')

        var variables = {
            'username': username,
            'type': type,
            'status': status
        }

        var data

        if (type === 'ANIME') {
            data = JSON.stringify({
                'query': queryAnime, 'variables': variables
            })

        } else {
            data = JSON.stringify({
                'query': queryManga, 'variables': variables
            })
        }


        const url = 'https://graphql.anilist.co'

        async function makeResponse(response) {

            if (response['status']) {

                const checkEmptyListFromStatus = response['data']['data']['MediaListCollection']['lists']

                if (checkEmptyListFromStatus && checkEmptyListFromStatus.length > 0) {

                    const urlImageUserInAnilist = response['data']['data']['MediaListCollection']['user']['avatar']['large']

                    const listWithResponses = response['data']['data']['MediaListCollection']['lists'][0]['entries']
                    const randomElement = listWithResponses[Math.floor(Math.random() * listWithResponses.length)]

                    const urlImageMedia = randomElement['media']['coverImage']['extraLarge']
                    const titleMedia = randomElement['media']['title']['romaji']
                    const urlMediaInAnilist = randomElement['media']['siteUrl']

                    let score = randomElement['media']['meanScore']
                    if (!isNumeric(score)) { score = 'X' }

                    if (type === 'ANIME') {

                        var episodes = randomElement['media']['episodes']
                        if (!isNumeric(episodes)) { episodes = 'X' }

                        var startYear = randomElement['media']['seasonYear']
                        if (!isNumeric(startYear)) { startYear = 'X' }

                    } else {

                        var chapters = randomElement['media']['chapters']
                        if (!isNumeric(chapters)) { chapters = 'X' }

                        var startYear = randomElement['media']['startDate']['year']
                        if (!isNumeric(startYear)) { startYear = 'X' }

                    }

                    let genres = randomElement['media']['genres']
                    try { genres = genres.join(', ') }
                    catch (error) { genres = 'X' }

                    let embedAnilist = new MessageEmbed()
                        .setTitle(titleMedia.slice(0, 256))
                        .setURL(urlMediaInAnilist)
                        .setImage(urlImageMedia)
                        .setTimestamp()
                        .addField('Score', score.toString().slice(0, 1024), true)
                        .setFooter(`Anilist - ${username}`, urlImageUserInAnilist)

                    if (type === 'ANIME') {

                        embedAnilist.addField('Episodes', episodes.toString().slice(0, 1024), true)
                        embedAnilist.addField('Year', startYear.toString().slice(0, 1024), true)
                        embedAnilist.setColor('#00A4FF')

                    } else {

                        embedAnilist.addField('Chapters', chapters.toString().slice(0, 1024), true)
                        embedAnilist.addField('Year', startYear.toString().slice(0, 1024), true)
                        embedAnilist.setColor('#23C423')

                    }

                    embedAnilist.addField('Genres', genres.slice(0, 1024), false)

                    await interaction.editReply({ embeds: [embedAnilist], ephemeral: false })

                } else {
                    await interaction.editReply({ content: `**${username}** does not have any **${type.toLowerCase()}** in **${status.toLowerCase()}**.`, ephemeral: false })
                }

            } else {
                await interaction.editReply({ content: `User not found in Anilist: **${username}**.`, ephemeral: false })
            }
        }

        const sendPostRequest = async () => {
            axios({
                method: 'POST',
                url,
                data: data,
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }).then(async function (res) {
                await makeResponse(res)
            }).catch(async function (error) {
                await makeResponse(error)
            })
        }

        sendPostRequest()
    }
}
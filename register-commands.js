const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const configs = require('./configs.json')

function RegisterSlashCommands(client_id, guild_id) {

    const commandsSlash_CHAT_INPUT = new Array(
        {
            name: 'help',
            description: 'Help for commands',
            type: 1,
        },
        {
            name: 'startping',
            description: 'Ping a member every 30sg',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'The user to get',
                    type: 6,
                    required: true
                },
                {
                    name: 'text',
                    description: 'Text to be repeated',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: 'endping',
            description: 'Cancel a startping running on the channel',
            type: 1,
        },
        {
            name: 'ping',
            description: 'Bot latency',
            type: 1,
        },
        {
            name: 'anilist',
            description: 'Choose a random from Anilist',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'Username in Anilist',
                    type: 3,
                    required: true
                },
                {
                    name: 'media',
                    description: 'Media',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'manga',
                            value: 'MANGA'
                        },
                        {
                            name: 'anime',
                            value: 'ANIME'
                        }
                    ]
                },
                {
                    name: 'status',
                    description: 'Media status that wants to choose a random',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'planning',
                            value: 'PLANNING'
                        },
                        {
                            name: 'completed',
                            value: 'COMPLETED'
                        },
                        {
                            name: 'current',
                            value: 'CURRENT'
                        },
                        {
                            name: 'dropped',
                            value: 'DROPPED'
                        },
                        {
                            name: 'paused',
                            value: 'PAUSED'
                        },
                        {
                            name: 'repeating',
                            value: 'REPEATING'
                        }
                    ]
                }
            ]
        },
        {
            name: 'stats',
            description: 'Some info about the bot',
            type: 1,
        },
        {
            name: 'purge',
            description: 'Delete messages - Required permission: Manage Messages',
            type: 1,
            options: [
                {
                    name: 'amount',
                    description: 'Amount of messages for delete',
                    type: 4,
                    required: true
                }
            ]
        },
        {
            name: 'games',
            description: 'Image manipulation commands',
            options: [
                {
                    name: 'rps',
                    description: 'Rock Paper Scissors',
                    type: 1,
                },
                {
                    name: 'duck',
                    description: 'Random Duck',
                    type: 1,
                },
                {
                    name: 'coffe',
                    description: 'Posts a random coffee',
                    type: 1,
                },
                {
                    name: 'coinflip',
                    description: 'Coinflip!',
                    type: 1,
                },
                {
                    name: 'slot',
                    description: 'Roll the slot machine',
                    type: 1,
                },
                {
                    name: 'hotcalc',
                    description: 'Returns a random percent for how hot is a discord user',
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: 'How hot is this discord user',
                            type: 6,
                            required: true
                        }
                    ],
                },
                {
                    name: 'rate',
                    description: 'Rates what you desire',
                    type: 1,
                    options: [
                        {
                            name: 'text',
                            description: 'What you desire',
                            type: 3,
                            required: true
                        }
                    ],
                },
                {
                    name: 'eightball',
                    description: 'I answer for you',
                    type: 1,
                    options: [
                        {
                            name: 'question',
                            description: 'Question for me to answer',
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    name: 'reverse',
                    description: 'Reverse your message',
                    type: 1,
                    options: [
                        {
                            name: 'text',
                            description: 'Text to reverse',
                            type: 3,
                            required: true
                        }
                    ]
                },
            ]
        },
        {
            name: 'copypastas',
            description: 'Commands copypastas',
            options: [
                {
                    name: 'send',
                    description: 'Send a copypasta',
                    type: 1,
                    options: [
                        {
                            name: 'name',
                            description: 'Name of copypasta',
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    name: 'delete',
                    description: 'Delete a copypasta you added',
                    type: 1,
                    options: [
                        {
                            name: 'name',
                            description: 'Copypasta that you added',
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    name: 'list',
                    description: 'List of copypastas available',
                    type: 1,
                },
                {
                    name: 'add',
                    description: 'Add an copypasta',
                    type: 1,
                    options: [
                        {
                            name: 'name',
                            description: 'Name of copypasta - 50 characters maximum',
                            type: 3,
                            required: true
                        },
                        {
                            name: 'text',
                            description: 'Text of copypasta',
                            type: 3,
                            required: true
                        }
                    ]
                }
            ]
        },
    );

    const commandsSlash_USER = new Array(
        {
            name: 'Startping',
            type: 2,
        }
    );

    const commandsSlash_MESSAGE = new Array(
        {
            name: 'Reverse',
            type: 3,
        },
        {
            name: 'Eightball',
            type: 3,
        },
        {
            name: 'Image to JPG',
            type: 3,
        }
    );

    const commands = [...commandsSlash_CHAT_INPUT, ...commandsSlash_USER, ...commandsSlash_MESSAGE]

    const rest = new REST({ version: '9' }).setToken(configs['token']);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            if (guild_id) {

                console.log(`Loading for guild ${guild_id}`)

                await rest.put(
                    Routes.applicationGuildCommands(client_id, guild_id),
                    { body: commands },
                );

            } else {

                console.log(`Loading for global - 1 hour delay for changes to be applied`)

                await rest.put(
                    Routes.applicationCommands(client_id),
                    { body: commands },
                );
            }
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
};

module.exports = { RegisterSlashCommands };
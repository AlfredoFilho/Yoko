
const { Interaction } = require('discord.js')

module.exports = {

    /**
     * 
     * @param {Interaction} interaction 
     * @param {*} args 
     */

    getNameCommand: async function (interaction, args) {

        let nameCommand = ''

        if (interaction.isButton()) {
            if (interaction.customId === 'rock' || interaction.customId === 'paper' || interaction.customId === 'scissors') {
                nameCommand = 'rps'
            }
        }

        else if (interaction.isSelectMenu()) {
            nameCommand = interaction.message.interaction.commandName
        }

        else {
            try { nameCommand = interaction.options.getSubcommand() }
            catch (error) { nameCommand = interaction.commandName }
        }

        if (nameCommand === 'Image to JPG') {
            nameCommand = 'tojpg'
        }

        return nameCommand.toLowerCase()
    }
}
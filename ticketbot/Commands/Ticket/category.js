const { CommandInteraction, Client } = require('discord.js');
const DB = require('../../src/Schemas/Ticket');
const { ColoreEmbed, FooterEmbedS } = require('../../botconfig/embed.json');

module.exports = {
    name: 'category',
    description: 'Staff Command',
    async execute(interaction, client) {
        const ticketdb = await DB.findOne({ticketID: interaction.channel.id, userID: interaction.user.id})
        interaction.reply({content: `${ticketdb.category}`})
    }
}
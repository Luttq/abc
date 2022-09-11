const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const DB = require('../../src/Schemas/Ticket');
const { ColoreEmbed, FooterEmbed } = require('../../botconfig/embed.json');

module.exports = {
    name: 'change_modalita',
    description: 'Cambia in quale modalità.',
    options: [
        {
            name: 'modalita',
            description: 'Scegli in quale modalità cambiare il ticket.',
            type: 'STRING',
            required: true,
            choices: [
                { name: 'WoolWars', value: 'woolwars'},
                { name: 'Survival', value: 'survival'}
            ],
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const choices = interaction.options.getString('modalita');
        const ticketdb = await DB.findOne({ticketID: interaction.channel.id, userID: interaction.user.id})
        if(!interaction.member.roles.cache.has('990969607617671228')) {
            return interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle('ERROR!')
                .setDescription('Non hai il permesso.')
                .setColor('#8b0000')
                .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
            ], ephemeral: true})
        }
        if(interaction.channel.id !== ticketdb.ticketID) {
            interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle('ERROR!')
                .setDescription('Il canale non è un ticket.')
                .setColor('#8b0000')
                .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
            ], ephemeral: true})
        }

        switch(choices) {
            case "woolwars": {
                interaction.channel.edit({
                    topic: `<@${ticketdb.userID}>｜WoolWars`
                })
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                    .setTitle('<:yes:988564639862374420> Ticket Aggiornato')
                    .setDescription(`Modalità settata a WoolWars.`)
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
                ]})
            }
            break;
            case "survival": {
                interaction.channel.edit({
                    topic: `<@${ticketdb.userID}>｜Survival`
                })
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                    .setTitle('<:yes:988564639862374420> Ticket Aggiornato')
                    .setDescription(`Modalità settata a Survival.`)
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
                ]})
            }
        }
    }
}
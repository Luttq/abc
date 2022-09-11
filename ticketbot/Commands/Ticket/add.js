const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const { ColoreEmbed, FooterEmbed } = require('../../botconfig/embed.json');
const { RuoloStaff } = require('../../botconfig/ticket.json');
const DB = require('../../src/Schemas/Ticket');

module.exports = {
    name: 'add',
    description: 'Aggiunge un player ad un ticket. [Staff Command]',
    options: [
        {
            name: 'user',
            description: 'Utente da aggiungere al ticket.',
            type: 'USER',
            required: true
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
            const guild = client.guilds.cache.get(interaction.guildId);
            const chan = guild.channels.cache.get(interaction.channelId);
            const player = interaction.options.getMember('user')
            const ticketdb = await DB.findOne({ticketID: interaction.channel.id, userID: interaction.user.id})
            const utente = client.users.cache.get(ticketdb.userID);
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
            if(player.id === client.user.id) {
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle('ERROR!')
                    .setDescription('Non posso aggiugermi da solo.')
                    .setColor('#8b0000')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                ], ephemeral: true})
            }
            if(player.id === ticketdb.userID) {
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle('ERROR!')
                    .setDescription("Non puoi aggiugere quest'utente.")
                    .setColor('#8b0000')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                ], ephemeral: true})
            }
            if(player.id === interaction.user.id) {
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle('ERROR!')
                    .setDescription('Non puoi aggiungerti da solo.')
                    .setColor('#8b0000')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                ], ephemeral: true})
            }
            interaction.reply({embeds: [
                new MessageEmbed()
                .setColor(ColoreEmbed)
                .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                .setTitle('<:yes:988564639862374420> Ticket Aggiornato')
                .setDescription(`Aggiunto ${utente} al ticket.`)
                .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
            ]})
            interaction.channel.permissionOverwrites.edit(player.id, { VIEW_CHANNEL: true })
    }
}
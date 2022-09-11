const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const { ColoreEmbed, FooterEmbed } = require('../../botconfig/embed.json');
const { LogTicketChannel, RuoloStaff } = require('../../botconfig/ticket.json');
const DB = require('../../src/Schemas/Ticket');

module.exports = {
    name: 'remove',
    description: 'Aggiunge un player ad un ticket. [Staff Command]',
    options: [
        {
            name: 'user',
            description: 'Utente da rimuovere dal ticket.',
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
            const ticketdb = await DB.findOne({ticketID: interaction.channel.id, userID: interaction.user.id})
            const utente = client.users.cache.get(ticketdb.userID);
            const player = interaction.options.getMember('user')
            if(interaction.channel.id !== ticketdb.ticketID) {
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle('ERROR!')
                    .setDescription('Il canale non è un ticket.')
                    .setColor('#8b0000')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                ], ephemeral: true})
            }
            if(!interaction.member.roles.cache.has('990969607617671228')) {
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle('ERROR!')
                    .setDescription('Non hai il permesso.')
                    .setColor('#8b0000')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                ], ephemeral: true})
            }
            if(player.id === client.user.id) {
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle('ERROR!')
                    .setDescription('Non posso rimuovermi da solo.')
                    .setColor('#8b0000')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                ], ephemeral: true})
            }
            if(player.id === ticketdb.userID) {
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle('ERROR!')
                    .setDescription("Non puoi rimuovere quest'utente.")
                    .setColor('#8b0000')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                ], ephemeral: true})
            }
            if(player.id === interaction.user.id) {
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle('ERROR!')
                    .setDescription('Non puoi rimuoverti da solo.')
                    .setColor('#8b0000')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                ], ephemeral: true})
            }
            const staffrole = client.guilds.cache.get('990668218920235110').roles.cache.get(RuoloStaff)
            if(player.roles.cache.has(staffrole)) {
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle('ERROR!')
                    .setDescription('Non puoi rimuovere uno staffer dal ticket.')
                    .setColor('#8b0000')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                ], ephemeral: true})
            }
            interaction.reply({embeds: [
                new MessageEmbed()
                .setColor(ColoreEmbed)
                .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                .setTitle('<:x_:988564638662807582> Ticket Aggiornato')
                .setDescription(`Rimosso ${player} dal ticket.`)
                .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
            ]})
            interaction.channel.permissionOverwrites.edit(player.id, { VIEW_CHANNEL: false })
    }
}
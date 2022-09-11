const { CommandInteraction, Client, MessageEmbed  } = require('discord.js');
const { ColoreEmbed, FooterEmbed } = require('../../botconfig/embed.json');
const { RuoloStaff } = require('../../botconfig/ticket.json')
const DB = require('../../src/Schemas/Ticket');

module.exports = {
    name: 'headstaff',
    description: "Rende il ticket accessibile solo all'headstaff. [Headstaff Command]",
    options: [
        {
            name: 'motivazione',
            description: '[Headstaff Command]',
            type: 'STRING',
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const chan = guild.channels.cache.get(interaction.channelId);
        const reason = interaction.options.getString('motivazione');
        const ticketdb = await DB.findOne({ticketID: interaction.channel.id, userID: interaction.user.id})
        const utente = client.users.cache.get(ticketdb.userID);
        if(interaction.channel.id !== ticketdb.ticketID) {
            interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle('ERROR!')
                .setDescription('Il canale non è un ticket.')
                .setColor('#8b0000')
                .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
            ], ephemeral: true})
        }
        if(!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle('ERROR!')
                .setDescription('Non hai il permesso.')
                .setColor('#8b0000')
                .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
            ], ephemeral: true})
        }
        const staffrole = client.guilds.cache.get('990668218920235110').roles.cache.get(RuoloStaff)
        const sradminrole = client.guilds.cache.get('990668218920235110').roles.cache.get('990691069844918332')
        const adminrole = client.guilds.cache.get('990668218920235110').roles.cache.get('990691686239846431')
        chan.edit({
            name: `hd-${utente.username}`,
            parent: '991409115115048982'
        })
        await DB.findOneAndUpdate(
            { ticketID: chan.id, userID: utente.id },
            { headstaff: true },
            {new: true, upsert: true}
        )
        chan.permissionOverwrites.edit(staffrole.id, { VIEW_CHANNEL: false })
        chan.permissionOverwrites.edit(adminrole.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true })
        chan.permissionOverwrites.edit(sradminrole.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true })
                if(reason) {
                    interaction.reply({embeds: [
                        new MessageEmbed()
                        .setColor(ColoreEmbed)
                        .setAuthor({name: interaction.user.username, iconURL: interaction.member.displayAvatarURL({dynamic: true})})
                        .setTitle('<:yes:988564639862374420> Ticket Aggiornato')
                        .setDescription("Ticket accessibile solo all'Headstaff")
                        .addField('Motivazione', reason)
                        .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
                    ]})
                }
                if(!reason) {
                    interaction.reply({embeds: [
                        new MessageEmbed()
                        .setColor(ColoreEmbed)
                        .setAuthor({name: interaction.user.username, iconURL: interaction.member.displayAvatarURL({dynamic: true})})
                        .setTitle('<:yes:988564639862374420> Ticket Aggiornato')
                        .setDescription("Ticket accessibile solo all'Headstaff")
                        .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
                    ]})
                }
    }
}
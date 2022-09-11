const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const DB = require('../../src/Schemas/Ticket');
const { ColoreEmbed, FooterEmbed } = require('../../botconfig/embed.json');

module.exports = {
    name: 'change_category',
    description: 'Cambia la categoria di un ticket. [Staff Command]',
    options: [
        {
            name: 'categoria',
            description: 'Scegli la categoria.',
            required: true,
            type: 'STRING',
            choices: [
                { name: '🆘Supporto Generale', value: 'Supporto' },
                { name: '🆘Candidatura Media', value: 'Media'},
                { name: '🆘Candidatura Staff', value: 'Staff'},
                { name: '🆘Richiesta Unban', value: 'Unban'},
                { name: '🆘Playerreport', value: 'Playerreport'},
                { name: '🆘Bugreport', value: 'Bugreport'}
            ],
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const choices = interaction.options.getString('categoria')
        const chan = guild.channels.cache.get(interaction.channelId);
        const ticketdb = await DB.findOne({ticketID: interaction.channel.id, userID: interaction.user.id})
        if(interaction.channel.id !== ticketdb.ticketID) {
            interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle('ERROR!')
                .setDescription('Il canale non è un ticket.')
                .setColor('#8b0000')
                .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
            ], ephemeral: true})
        }
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
        switch(choices) {
            case "Supporto": {
                if(ticketdb.category === 'Supporto') {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setTitle('ERROR!')
                        .setDescription('La categorià è già settata a supporto.')
                        .setColor('#8b0000')
                        .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                    ], ephemeral: true})
                }
                await DB.findOneAndUpdate(
                    { ticketID: interaction.channel.id },
                    { category: 'Supporto'}
                    )
                interaction.channel.edit({
                    name: `supporto-${utente.username}`,
                    parent: '991398410181673111'
                })
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                    .setTitle('<:yes:988564639862374420> Ticket Aggiornato')
                    .setDescription(`Categoria cambiata a supporto generale.`)
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
                ]})
            }
            break;
            case "Media": {
                if(ticketdb.category === 'Candidatura Media') {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setTitle('ERROR!')
                        .setDescription('La categorià è già settata a candidatura media.')
                        .setColor('#8b0000')
                        .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                    ], ephemeral: true})
                }
                await DB.findOneAndUpdate(
                    { ticketID: interaction.channel.id },
                    { category: 'Candidatura Media'}
                    )
                chan.edit({
                    name: `candidatura-${utente.username}`,
                    parent: '991398486052446318'
                })
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                    .setTitle('<:yes:988564639862374420> Ticket Aggiornato')
                    .setDescription(`Categoria cambiata a candidatura media.`)
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
                ]})
            }
            break;
            case "Staff": {
                if(ticketdb.category === 'Candidatura Staff') {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setTitle('ERROR!')
                        .setDescription('La categorià è già settata a candidatura staff.')
                        .setColor('#8b0000')
                        .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                    ], ephemeral: true})
                }
                await DB.findOneAndUpdate(
                    { ticketID: interaction.channel.id },
                    { category: 'Candidatura Staff'}
                    )
                interaction.channel.edit({
                    name: `candidatura-${utente.username}`,
                    parent: '991398533456470086'
                })
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                    .setTitle('<:yes:988564639862374420> Ticket Aggiornato')
                    .setDescription(`Categoria cambiata a candidatura staff.`)
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
                ]})
            }
            break;
            case "Unban": {
                if(ticketdb.category === 'Unban') {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setTitle('ERROR!')
                        .setDescription('La categorià è già settata a candidatura staff.')
                        .setColor('#8b0000')
                        .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                    ], ephemeral: true})
                }
                await DB.findOneAndUpdate(
                    { ticketID: interaction.channel.id },
                    { category: 'Unban'}
                    )
                interaction.channel.edit({
                    name: `unban-${utente.username}`,
                    parent: '991398581737103450'
                })
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                    .setTitle('<:yes:988564639862374420> Ticket Aggiornato')
                    .setDescription(`Categoria cambiata ad unban.`)
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
                ]})
            }
            break;
            case "Playerreport": {
                if(ticketdb.category === 'Report Player') {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setTitle('ERROR!')
                        .setDescription('La categorià è già settata a candidatura staff.')
                        .setColor('#8b0000')
                        .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                    ], ephemeral: true})
                }
                await DB.findOneAndUpdate(
                    { ticketID: interaction.channel.id },
                    { category: 'Report Player'}
                    )
                interaction.channel.edit({
                    name: `playerreport-${utente.username}`,
                    parent: '991398626700046467'
                })
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                    .setTitle('<:yes:988564639862374420> Ticket Aggiornato')
                    .setDescription(`Categoria cambiata a player report.`)
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
                ]})
            }
            break;
            case "Bugreport": {
                if(ticketdb.category === 'Report Bug') {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setTitle('ERROR!')
                        .setDescription('La categorià è già settata a candidatura staff.')
                        .setColor('#8b0000')
                        .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                    ], ephemeral: true})
                }
                await DB.findOneAndUpdate(
                    { ticketID: interaction.channel.id },
                    { category: 'Report Bug'}
                    )
                interaction.channel.edit({
                    name: `bugreport-${utente.username}`,
                    parent: '991398626700046467'
                })
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                    .setTitle('<:yes:988564639862374420> Ticket Aggiornato')
                    .setDescription(`Categoria cambiata a bug report.`)
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
                ]})
            }
            break
            
        }
    }
}
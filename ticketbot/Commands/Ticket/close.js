const { CommandInteraction, Client, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { ColoreEmbed, FooterEmbed } = require('../../botconfig/embed.json');
const DB = require('../../src/Schemas/Ticket');
const { LogTicketChannel } = require('../../botconfig/ticket.json');
const createTranscript = require('discord-html-transcripts');
const chalk = require('chalk');

module.exports = {
    name: 'close',
    description: 'Chiude un ticket. [Mod Command]',
    options: [
        {
            name: 'motivazione',
            description: 'Motivazione per cui chiudere il ticket.',
            type: 'STRING',
            required: false
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
            const reason = interaction.options.getString('motivazione');
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
            const transcript = await createTranscript.createTranscript(chan, {limit: -1, returnBuffer: false, fileName: `ticket-${utente.username}.html`});
                const embed = new MessageEmbed()
                  .setAuthor({name: interaction.user.username, iconURL: interaction.member.displayAvatarURL({dynamic: true})})
                  .setTitle(`Ticket ${utente.username}`)
                  .addField('Trascrizione del ticket', `Scarica il file`, true)
                  .setColor(ColoreEmbed)
                  .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true})});
    
                const embed2 = new MessageEmbed()
                  .setAuthor({name: interaction.user.username, iconURL: interaction.member.displayAvatarURL({dynamic: true})})
                  .setTitle(`Ticket ${utente.username}`)
                  .addField('Trascrizione del ticket', `Scarica il file`, true)
                  .setColor(ColoreEmbed)
                  .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true})});

                interaction.reply({
                embeds:[
                    new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setAuthor({name: interaction.user.username, iconURL: interaction.member.displayAvatarURL({dynamic: true})})
                    .setTitle('<:x_:988564638662807582> Ticket Chiuso')
                    .setDescription('Sto eliminando il ticket..')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
                ]
                });
                const row = new MessageActionRow()
                .addComponents(
                  new MessageButton()
                  .setCustomId('1stella')
                  .setStyle('DANGER')
                  .setLabel('⭐1'),
                  new MessageButton()
                  .setCustomId('2stelle')
                  .setStyle('DANGER')
                  .setLabel('⭐2'),
                  new MessageButton()
                  .setCustomId('3stelle')
                  .setStyle('PRIMARY')
                  .setLabel('⭐3'),
                  new MessageButton()
                  .setCustomId('4stelle')
                  .setStyle('SUCCESS')
                  .setLabel('⭐4'),
                  new MessageButton()
                  .setCustomId('5stelle')
                  .setStyle('SUCCESS')
                  .setLabel('⭐5')
                )
                await DB.deleteOne({ ticketID: interaction.channel.id })
    
                if(reason) {
                utente.send({
                    embeds: [embed2.addField('Motivazione', reason)], files: [transcript], components: [row]
                }).catch(() => {console.log(chalk.italic(`Non riesco a mandare all'utente ${utente.tag} i log del ticket in privato.`))})
                    client.channels.cache.get(LogTicketChannel).send({
                        embeds: [embed.addField('Motivazione', reason)],
                        files: [transcript]
                      }).catch(() => console.log("Canale per i log del ticket non trovato."));
                }
                if(!reason) {
                utente.send({
                    embeds: [embed2], files: [transcript], components: [row]
                }).catch(() => {console.log(chalk.italic(`Non riesco a mandare all'utente ${utente.tag} i log del ticket in privato.`))})
                client.channels.cache.get(LogTicketChannel).send({
                  embeds: [embed],
                  files: [transcript]
                }).catch(() => console.log("Canale per i log del ticket non trovato."));
                }
    
    
    
                setTimeout(() => {
                  chan.delete();
                }, 5000);
    }
}
const chalk = require('chalk');
const { CommandInteraction, Client, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Owner } = require('../../botconfig/config.json')
const { FooterEmbed, ColoreEmbed } = require('../../botconfig/embed.json')

module.exports = {
    name: 'ticket-panel',
    description: 'Sistema di ticket',
    options: [
        {
            name: 'canale',
            description: 'Seleziona il canale dove vuoi mandare il pannello per i ticket.',
            type: 'CHANNEL',
            required: true
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const canale = interaction.options.getChannel('canale');
        if(!interaction.member.permissions.has('ADMINISTRATOR')) {
          return interaction.reply({embeds: [
              new MessageEmbed()
              .setTitle('ERROR!')
              .setDescription('Non hai il permesso.')
              .setColor('#8b0000')
              .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
          ], ephemeral: true})
      }
        interaction.reply({embeds: [
            new MessageEmbed()
            .setColor(ColoreEmbed)
            .setTitle('Ticket')
            .setDescription('Pannello per creare i ticket mandato correttamente.')
            .setFooter({ text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
        ], ephemeral: true})

            function sendTicketMSG() {
              const embed = new MessageEmbed()
                .setColor(ColoreEmbed)
                .setAuthor({name: 'Supporto?'})
                .setDescription('Hai bisogno di supporto? Apri un ticket cliccando il bottone qui sotto, il nostro staff \nti assisterà al più presto.')
                .setFooter({ text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
              const row = new MessageActionRow()
                .addComponents(
                  new MessageButton()
                  .setCustomId('open-ticket')
                  .setLabel('✅Apri un ticket')
                  .setStyle('SUCCESS'),
                );
        
              canale.send({
                embeds: [embed],
                components: [row]
              })
            }

              sendTicketMSG()
              console.log(chalk.italic(' Mandando il messaggio per creare un ticket..'))
    }
}

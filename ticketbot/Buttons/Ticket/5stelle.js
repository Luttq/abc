const { MessageEmbed, Client, ButtonInteraction } = require('discord.js');
const { ColoreEmbed, FooterEmbed } = require('../../botconfig/embed.json');

module.exports = {
    id: '5stelle',
    /**
     * 
     * @param {ButtonInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const channel = client.channels.cache.get('991404624122757240')

        interaction.reply({content: 'Sto mandando la valutazione.', ephemeral: true})
        setTimeout(() => {
            interaction.editReply({content: 'Ho mandato correttamente la tua valutazione.', ephemeral: true})
        }, 700);

        interaction.message.edit({components: []})

        channel.send({embeds: [
            new MessageEmbed()
            .setColor(ColoreEmbed)
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
            .setTitle('Valutazione Ticket')
            .addField("L'utente ha votato", '⭐5')
            .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
        ]})

    }
}
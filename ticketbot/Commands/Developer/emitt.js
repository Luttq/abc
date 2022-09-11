const { CommandInteraction, Client } = require('discord.js');

module.exports = {
    name: 'emetti',
    description: 'Emetti un evento',
    permission: 'ADMINISTRATOR',
    options: [
        {
            name: 'evento',
            description: 'Evento da Emettere (Entrata e uscita del player).',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'EntrataPlayer',
                    value: 'EntrataPlayer'
                },
                {
                    name: 'UscitaPlayer',
                    value: 'UscitaPlayer'
                }
            ]
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const choices = interaction.options.getString('evento');

        switch(choices) {
            case 'EntrataPlayer' : {
                client.emit('guildMemberAdd', interaction.member);
                interaction.reply({content: 'Evento correttamente eseguito', ephemeral: true })
            }
            break;
            case 'UscitaPlayer' : {
                client.emit('guildMemberRemove', interaction.member);
                interaction.reply({content: 'Evento correttamente eseguito', ephemeral: true })
            }
            break;
        }
    }
}
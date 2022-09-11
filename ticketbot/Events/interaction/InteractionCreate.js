const { Client, CommandInteraction, MessageEmbed, GuildMember } = require("discord.js");
const { FooterEmbed, ColoreEmbed } = require('../../botconfig/embed.json')

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {GuildMember} member
     */
    async execute(interaction, client, member) {
        if(interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if(!command) return interaction.reply({embeds: [
                new MessageEmbed()
                .setColor('#8b0000')
                .setTitle('ERROR!')
                .setDescription("⛔Si è verificato un errore nell'esecuzione del comando.")
            ]}) && client.commands.delete(interaction.commandName);

            if(command.disable === 'true') {
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle('DISABILITATO')
                    .setDescription('Questo comando è disabilitato.')
                    .setColor('#E5BE01')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
                ], ephemeral: true});
            }

            command.execute(interaction, client)

            if (command.permission && !interaction.member.permissions.has(command.permission)) {
                return interaction.reply({ embeds: [
                    new MessageEmbed()
                    .setTitle('ERROR!')
                    .setDescription('Non hai il permesso.')
                    .setColor('#8b0000')
                ], ephemeral: true })
            }
        }
    }
}
const { ButtonInteraction }  = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {ButtonInteraction} interaction
     */
    execute(interaction, client) {
        if(!interaction.isButton()) return;
        const Button = client.buttons.get(interaction.customId);

        if(!Button) return;

        if(Button.permission && !interaction.member.permissions.has(Button.permission))
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle('ERROR!')
            .setDescription('Non hai il permesso.')
            .setColor('#8b0000')
            .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
        ], ephemeral: true});

        if(Button.ownerOnly && interaction.member.id !== interaction.guild.ownerId)
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle('ERROR!')
            .setDescription('Non hai il permesso.')
            .setColor('#8b0000')
            .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
        ], ephemeral: true});

        Button.execute(interaction, client);
    }
}
const { SelectMenuInteraction }  = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {SelectMenuInteraction} interaction
     */
    execute(interaction, client) {
        if(!interaction.isSelectMenu()) return;
        const SelectMenu = client.selectmenus.get(interaction.values[0]);

        if(!SelectMenu) return;

        if(SelectMenu.permission && !interaction.member.permissions.has(SelectMenu.permission))
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle('ERROR!')
            .setDescription('Non hai il permesso.')
            .setColor('#8b0000')
            .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
        ], ephemeral: true});

        if(SelectMenu.ownerOnly && interaction.member.id !== interaction.guild.ownerId)
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle('ERROR!')
            .setDescription('Non hai il permesso.')
            .setColor('#8b0000')
            .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true, size: 512})})
        ], ephemeral: true});

        SelectMenu.execute(interaction, client);
    }
}
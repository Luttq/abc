const { Perms } = require('../Validation/Permissions');
const { Client } = require('discord.js');

/**
 * @param {Client} client
 */
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii('Comandi Caricati');

    CommandsArray = [];

    (await PG(`${(process.cwd().replace(/\\/g, "/"))}/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if(!command.name)
        return Table.addRow(file.split('/')[7], '⛔Non caricato', 'Manca il nome.')

        if(!command.context && !command.description)
        return Table.addRow(command.name, '⛔Non caricato', 'Manca la descrizione.')

        if(command.permission) {
            if(Perms.includes(command.permission))
            command.defaultPermission = false;
            else
            return Table.addRow(command.name, '⛔Non caricato', 'I permissi sono invalidi.')
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, '✅Caricato');
    })


    console.log(Table.toString());

    // Check Permessi //

    /*
    client.on('guildCreate', async (guild) => {
        const mainGuild = await client.guilds.cache.get(`${guild.id}`);
        const chalk = require('chalk')
        mainGuild.commands.set(CommandsArray);
        console.log(chalk.italic(`Comandi Registrati per il server ${guild.name}`))
    });
    */

    client.on('ready', async (guild) => {
        const mainGuild = await client.guilds.cache.get(`990668218920235110`);
        console.log(`✅Comandi registrati SOLO per il server ${mainGuild.name}`)
        mainGuild.commands.set(CommandsArray);
    });
}
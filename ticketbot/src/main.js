const { Client, Collection } = require('discord.js');
const client = new Client({
    intents: 32767
})
const { Token } = require('../botconfig/config.json')
const { promisify } = require('util')
const { glob } = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');

client.buttons = new Collection();
client.selectmenus = new Collection();
client.commands = new Collection();

module.exports = client;

require('./Handlers/Anticrash')(client);

["Events", "Commands", "Buttons", "SelectMenus"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, Ascii)
})

client.login(Token)
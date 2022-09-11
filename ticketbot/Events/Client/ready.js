const { Client } = require('discord.js');
const { default: mongoose } = require('mongoose')
const  { Presenza1, Presenza2, Stato, TipoPresenza } = require('../../botconfig/Presence.json');
const { DatabaseURL } = require('../../botconfig/config.json')
/**
 * @param {Client} client
 */

module.exports = {
    name: 'ready',
    once: true,
    /**
    * @param {Client} client
    */
    execute(client) {
        const { guilds } = client;
        const piciozserver = client.guilds.cache.get('963069398548090910')
        console.log('✅Il bot è online')
        console.log('✅Grazie per aver usato il nostro bot creato da andrew.')
        const activities_list = [
            ``, 
            ``,
            ``,
            ``
            ];
            setInterval(() => {
                const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
                client.user.setStatus(Stato)
                client.user.setActivity('LemonClub🍋', { type: TipoPresenza,  });
            }, 5000);
            if(!DatabaseURL) return
            mongoose.connect(DatabaseURL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(() => {
                console.log('✅Il bot è connesso al Database')
            }).catch((err) => {
                console.log(err)
            });
    }
}
const { Events } = require('../Validation/EventsNames');

module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii('Eventi caricati');

    (await PG(`${(process.cwd().replace(/\\/g, "/"))}/Events/*/*.js`)).map(async (file) => {
        const event = require(file);
        if(!Events.includes(event.name) || !event.name) {
            const L = file.split('/');
            await Table.addRow(`${event.name || 'Mancante'}`, `⛔Il nome dell'evento è mancante e/o invalido: ${L[6] + `/` + L[7]}`);
            return;
        }

        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client))
        } else {
            client.on(event.name, (...args) => event.execute(...args, client))
        };

        await Table.addRow(event.name, '✅Caricato')

    })

    console.log(Table.toString());
}
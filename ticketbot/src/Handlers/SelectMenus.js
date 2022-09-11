module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("SelectMenus");
    const SelectMenuFolder = await PG(`${(process.cwd().replace(/\\/g, "/"))}/SelectMenu/**/*.js`);

    SelectMenuFolder.map(async (file) => {
        const menuFile = require(file);
        if(!menuFile.value) return;

        client.selectmenus.set(menuFile.value, menuFile);
        Table.addRow(menuFile.value, "✅Caricato");
    })
    console.log(Table.toString());
}
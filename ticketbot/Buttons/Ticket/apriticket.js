const { MessageEmbed, ButtonInteraction, Client, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
const DB = require('../../src/Schemas/Ticket');
const { ColoreEmbed, FooterEmbed } = require('../../botconfig/embed.json')
const { RuoloStaff } = require('../../botconfig/ticket.json')

module.exports = {
    id: 'open-ticket',
    /**
     * 
     * @param {ButtonInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        /* Abilita questa opzione se vuoi che i player non aprano piu' di un ticket.
      if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
        return interaction.reply({
          content: 'Hai già creato un ticket!',
          ephemeral: true
        });
      };
      */
      interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
        parent: '991398410181673111',
        topic: `${interaction.user}｜`,
        permissionOverwrites: [{
            id: interaction.user.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: RuoloStaff,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
            allow: ['SEND_MESSAGES'],
          },
        ],
        type: "GUILD_TEXT",
      }).then(async c => {
        await DB.create({
          userID: interaction.user.id,
          ticketID: c.id,
          category: 'none',
          headstaff: false,
        })
        interaction.reply({
          content: 'Sto creando il ticket, aspetta un secondo.',
          ephemeral: true
        });

        setTimeout(() => {
          interaction.editReply({content: `Ticket creato correttamente, il nostro staff ti assisterà al più presto. <#${c.id}>`, ephemeral: true})
        }, 700);
        
        const ticketdb = await DB.findOne({ticketID: c.id, userID: interaction.user.id})

        const embed = new MessageEmbed()
          .setColor(ColoreEmbed)
          .setAuthor({name: `Ticket di ${interaction.user.username}`})
          .setThumbnail('https://cdn.discordapp.com/icons/990668218920235110/0154d7f27a5634ea5bc9f5fa14df5939.png?size=1024')
          .setDescription('Seleziona la categoria del ticket\ncosì che lo staff ti possa aiutare al meglio.')
          .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL()})
          .setTimestamp();

        const row = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
            .setCustomId('category')
            .setPlaceholder('Seleziona la categoria...')
            .addOptions([{
                label: '✅Supporto',
                description: 'Scegli questa categoria per ricevere supporto.',
                value: 'Supporto',
              },
              {
                label: '🎬Candidatura Media',
                description: 'Scegli questa categoria per candidarti come media',
                value: 'CandidaturaMedia',
              },
              {
                label: '⭐Candidatura Staff',
                description: 'Scegli questa categoria per candidarti come staff',
                value: 'CandidaturaStaff',
              },
              {
                label: '🛑Richiesta Unban',
                description: 'Scegli questa categoria per appellare un ban',
                value: 'Unban'
              },
              {
                label: '🌍Report Player',
                description: 'Scegli questa categoria per reportare un player',
                value: 'reportplayer'
              },
              {
                label: '📘Report Bug',
                description: 'Scegli questa categoria per reportare un bug',
                value: 'reportbug'
              }
            ]),
          );

        msg = await c.send({
          content: `<@!${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });

        const collector = msg.createMessageComponentCollector({
          componentType: 'SELECT_MENU'
        });

        collector.on('collect', i => {
          if (i.user.id === interaction.user.id) {
            if (i.values[0] == 'Supporto') {
              if (msg.deletable) {
                msg.delete().then(async () => {
                  const embed = new MessageEmbed()
                  .setColor(ColoreEmbed)
                  .setTitle('Supporto Generale.')
                  .setDescription(`Ciao <@!${interaction.user.id}>, hai aperto un ticket per supporto generale.`)
                  .setThumbnail('https://cdn.discordapp.com/icons/990668218920235110/0154d7f27a5634ea5bc9f5fa14df5939.png?size=1024')
                  .addField('Ti chiediamo di rispondere a queste domande:', 'Descrivi il tuo problema:\nEventuali informazioni:\n\nIl nostro staff ti assisterà al più presto.')
                  .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true})})
                  .setTimestamp()

                  await DB.deleteOne({ ticketID: c.id, userID: interaction.user.id })

                  await DB.create({
                    userID: interaction.user.id,
                    ticketID: c.id,
                    category: 'Supporto',
                    headstaff: false,
                  })

                  const row = new MessageActionRow()
                    .addComponents(
                      new MessageButton()
                      .setCustomId('close-ticket')
                      .setLabel('Chiudi')
                      .setEmoji('✖')
                      .setStyle('DANGER'),
                      new MessageButton()
                      .setCustomId('lock')
                      .setLabel('Lock')
                      .setEmoji('🔒')
                      .setStyle('PRIMARY'),
                      new MessageButton()
                      .setCustomId('unlock')
                      .setLabel('Unlock')
                      .setEmoji('🔓')
                      .setStyle('SECONDARY'),
                    );
  
                  const opened = await c.send({
                    // content: `<@&${RuoloStaff}>`,
                    embeds: [embed]
                  });
  
                  opened.pin().then(() => {
                    opened.channel.bulkDelete(1);
                  });
                });
              };
                c.edit({
                    name: `supporto-${interaction.user.username}`,
                  parent: '991398410181673111'
                });
              };
              if (i.values[0] == 'CandidaturaMedia') {
                if (msg.deletable) {
                  msg.delete().then(async () => {
                    const embed = new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setTitle('Candidatura Media.')
                    .setThumbnail('https://cdn.discordapp.com/icons/990668218920235110/0154d7f27a5634ea5bc9f5fa14df5939.png?size=1024')
                    .setDescription(`Ciao <@!${interaction.user.id}>, hai aperto un ticket per candidarti come media.`)
                    .addField('Ti chiediamo di rispondere a queste domande:', 'Perchè vuoi fare candidarti:\nLink canale YT o qualunque altro link:\n\nIl nostro Staff ti risponderà al più presto.')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true})})
                    .setTimestamp()

                    await DB.deleteOne({ ticketID: c.id, userID: interaction.user.id })

                    await DB.create({
                      userID: interaction.user.id,
                      ticketID: c.id,
                      category: 'Candidatura Media',
                      headstaff: false,
                    })
    
                    const row = new MessageActionRow()
                      .addComponents(
                        new MessageButton()
                        .setCustomId('close-ticket')
                        .setLabel('Chiudi')
                        .setEmoji('✖')
                        .setStyle('DANGER'),
                        new MessageButton()
                        .setCustomId('lock')
                        .setLabel('Lock')
                        .setEmoji('🔒')
                        .setStyle('PRIMARY'),
                        new MessageButton()
                        .setCustomId('unlock')
                        .setLabel('Unlock')
                        .setEmoji('🔓')
                        .setStyle('SECONDARY'),
                      );
    
                    const opened = await c.send({
                      // content: `<@&${RuoloStaff}>`,
                      embeds: [embed]
                    });
    
                    opened.pin().then(() => {
                      opened.channel.bulkDelete(1);
                    });
                  });
                };
                c.edit({
                    name: `candidatura-${interaction.user.username}`,
                  parent: '991398486052446318'
                });
              };
              if (i.values[0] == 'CandidaturaStaff') {
                if (msg.deletable) {
                  msg.delete().then(async () => {
                    const embed = new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setTitle('Candidatura Staff.')
                    .setThumbnail('https://cdn.discordapp.com/icons/990668218920235110/0154d7f27a5634ea5bc9f5fa14df5939.png?size=1024')
                    .setDescription(`Ciao <@!${interaction.user.id}>, hai aperto un ticket per candidarti come staff.`)
                    .addField('Ti chiediamo di rispondere a queste domande:', "Perchè vuoi candidarti come staffer:\nPerchè dovremmo sceglioere proprio te:\nEtà:\nHai avuto già altre esperienze:\n\nIl nostro staff ti assisterà al più presto.")
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true})})
                    .setTimestamp()

                    await DB.deleteOne({ ticketID: c.id, userID: interaction.user.id })

                    await DB.create({
                      userID: interaction.user.id,
                      ticketID: c.id,
                      category: 'Candidatura Staff',
                      headstaff: false,
                    })
    
                    const row = new MessageActionRow()
                      .addComponents(
                        new MessageButton()
                        .setCustomId('close-ticket')
                        .setLabel('Chiudi')
                        .setEmoji('✖')
                        .setStyle('DANGER'),
                        new MessageButton()
                        .setCustomId('lock')
                        .setLabel('Lock')
                        .setEmoji('🔒')
                        .setStyle('PRIMARY'),
                        new MessageButton()
                        .setCustomId('unlock')
                        .setLabel('Unlock')
                        .setEmoji('🔓')
                        .setStyle('SECONDARY'),
                      );
    
                    const opened = await c.send({
                      // content: `<@&${RuoloStaff}>`,
                      embeds: [embed]
                    });
    
                    opened.pin().then(() => {
                      opened.channel.bulkDelete(1);
                    });
                  });
                };
                c.edit({
                    name: `candidatura-${interaction.user.username}`,
                  parent: '991398533456470086'
                });
              };
              if (i.values[0] == 'Unban') {
                if (msg.deletable) {
                  msg.delete().then(async () => {
                    const embed = new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setTitle('Richiesta Unban.')
                    .setThumbnail('https://cdn.discordapp.com/icons/990668218920235110/0154d7f27a5634ea5bc9f5fa14df5939.png?size=1024')
                    .setDescription(`Ciao <@!${interaction.user.id}>, hai aperto un ticket per una richiesta Unban.`)
                    .addField('Ti chiediamo di rispondere a queste domande:', ':\nNick in game:\nMotivazione del ban:\nDurata del ban:\nEventuali informazioni:\n\nIl nostro staff ti risponderà al più presto.')
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true})})
                    .setTimestamp()

                    await DB.deleteOne({ ticketID: c.id, userID: interaction.user.id })

                    await DB.create({
                      userID: interaction.user.id,
                      ticketID: c.id,
                      category: 'Unban',
                      headstaff: false,
                    })
    
                    const row = new MessageActionRow()
                      .addComponents(
                        new MessageButton()
                        .setCustomId('close-ticket')
                        .setLabel('Chiudi')
                        .setEmoji('✖')
                        .setStyle('DANGER'),
                        new MessageButton()
                        .setCustomId('lock')
                        .setLabel('Lock')
                        .setEmoji('🔒')
                        .setStyle('PRIMARY'),
                        new MessageButton()
                        .setCustomId('unlock')
                        .setLabel('Unlock')
                        .setEmoji('🔓')
                        .setStyle('SECONDARY'),
                      );
    
                    const opened = await c.send({
                      // content: `<@&${RuoloStaff}>`,
                      embeds: [embed]
                    });
    
                    opened.pin().then(() => {
                      opened.channel.bulkDelete(1);
                    });
                  });
                };
                c.edit({
                    name: `unban-${interaction.user.username}`,
                  parent: '991398581737103450'
                });
              };
              if (i.values[0] == 'reportplayer') {
                if (msg.deletable) {
                  msg.delete().then(async () => {
                    const embed = new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setTitle('Report Player.')
                    .setThumbnail('https://cdn.discordapp.com/icons/990668218920235110/0154d7f27a5634ea5bc9f5fa14df5939.png?size=1024')
                    .setDescription(`Ciao <@!${interaction.user.id}>, hai aperto un ticket per reportare un player.`)
                    .addField('Ti chiediamo di rispondere a queste domande:', "\nNick del player:\nRegola Violata:\nProve video o audio\nTestimoni:\n\nIl nostro staff ti assisterà al più presto.")
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true})})
                    .setTimestamp()

                    await DB.deleteOne({ ticketID: c.id, userID: interaction.user.id })

                    await DB.create({
                      userID: interaction.user.id,
                      ticketID: c.id,
                      category: 'Report Player',
                      headstaff: false,
                    })
    
                    const row = new MessageActionRow()
                      .addComponents(
                        new MessageButton()
                        .setCustomId('close-ticket')
                        .setLabel('Chiudi')
                        .setEmoji('✖')
                        .setStyle('DANGER'),
                        new MessageButton()
                        .setCustomId('lock')
                        .setLabel('Lock')
                        .setEmoji('🔒')
                        .setStyle('PRIMARY'),
                        new MessageButton()
                        .setCustomId('unlock')
                        .setLabel('Unlock')
                        .setEmoji('🔓')
                        .setStyle('SECONDARY'),
                      );
    
                    const opened = await c.send({
                      // content: `<@&${RuoloStaff}>`,
                      embeds: [embed]
                    });
    
                    opened.pin().then(() => {
                      opened.channel.bulkDelete(1);
                    });
                  });
                };
                c.edit({
                    name: `playerreport-${interaction.user.username}`,
                  parent: '991398626700046467'
                });
              };
              if (i.values[0] == 'reportbug') {
                if (msg.deletable) {
                  msg.delete().then(async () => {
                    const embed = new MessageEmbed()
                    .setColor(ColoreEmbed)
                    .setTitle('Report Bug.')
                    .setThumbnail('https://cdn.discordapp.com/icons/990668218920235110/0154d7f27a5634ea5bc9f5fa14df5939.png?size=1024')
                    .setDescription(`Ciao <@!${interaction.user.id}>, hai aperto un ticket per reportare un bug.`)
                    .addField('Ti chiediamo di rispondere a queste domande:', "\nInformazioni sul bug:\nGravità da 1 a 10:\nFoto o video:\n\nIl nostro staff ti assisterà al più presto.")
                    .setFooter({text: FooterEmbed, iconURL: client.user.displayAvatarURL({dynamic: true})})
                    .setTimestamp()

                    await DB.deleteOne({ ticketID: c.id, userID: interaction.user.id })

                    await DB.create({
                      userID: interaction.user.id,
                      ticketID: c.id,
                      category: 'Report Bug',
                      headstaff: false,
                    })
    
                    const row = new MessageActionRow()
                      .addComponents(
                        new MessageButton()
                        .setCustomId('close-ticket')
                        .setLabel('Chiudi')
                        .setEmoji('✖')
                        .setStyle('DANGER'),
                        new MessageButton()
                        .setCustomId('lock')
                        .setLabel('Lock')
                        .setEmoji('🔒')
                        .setStyle('PRIMARY'),
                        new MessageButton()
                        .setCustomId('unlock')
                        .setLabel('Unlock')
                        .setEmoji('🔓')
                        .setStyle('SECONDARY'),
                      );
    
                    const opened = await c.send({
                      // content: `<@&${RuoloStaff}>`,
                      embeds: [embed]
                    });
    
                    opened.pin().then(() => {
                      opened.channel.bulkDelete(1);
                    });
                  });
                };
                c.edit({
                    name: `bugreport-${interaction.user.username}`,
                  parent: '991398626700046467'
                });
              };
            };
          });
      });
    }
}
/**
 * Author: Amit Kumar
 * Github: https://github.com/AmitKumarHQ
 * Created On: 27th March 2022
 */

 const { GuildMember, MessageEmbed, Client } = require("discord.js");
 const { drawCard, Text, Gradient } = require('discord-welcome-card');
 const { registerFont } = require('canvas');
 const { join } = require('path');
 
 module.exports = {
     name: "guildMemberAdd",
 
     /**
      * 
      * @param {GuildMember} member 
      * @param {Client} client
      */
     async execute(member, client) {
         const { guild } = member;
 
         if(member.user.bot) return;
         registerFont(join(__dirname, '../../src/Fonts/Panton_Black_Caps.ttf'), { family: 'Panton' }); 
 
         const image = await drawCard({
             theme: 'dark',
             blur: false,
             ronded: true,
             text: {
                 title: new Text('Benvenuto!', 250, 100)
                     .setFontSize(35)
                     .setStyle(`#fff700`),
                 text: new Text(member.user.username, 250, 170)
                     .setFontSize(55),
                 color: `#DDDDDD`,
                 font: 'Panton Black Caps',
             },
             avatar: {
                 image: member.user.avatarURL({
                     dynamic: true,
                     format: 'png',
                     size: 2048,
                 }),
                 borderRadius: 1, // Corner radius of the avatar (0.5 = 50% rounded)
                 imageRadius: 0.75, // Size of the avatar (0.85 = 85%)
                 outlineWidth: 10,
                 outlineColor: "#fff700",
             },
         });
 
         const embed = new MessageEmbed()
         .setColor(`#55FF55`)
         .setAuthor({
             name: `NEW USER JOINED`,
             iconURL: member.user.displayAvatarURL({
                 dynamic: true,
                 format: 'png',
             })
         })
         .setDescription(`Thank you for joining the server!`)
         .setThumbnail(member.user.displayAvatarURL({
             dynamic: true,
             format: 'png',
         }))
 
         client.channels.cache.get('991413704027537508').send({
             // embeds: [embed],
             files: [{
                 attachment: image
             }]
         });
     }
 }
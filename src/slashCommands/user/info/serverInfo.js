const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Ver la información del servidor"),

  async execute(client, interaction, prefix) {
    try {
      const server = interaction.member.guild;
      // Crear un embed
      const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setThumbnail(
          server.iconURL({
            dynamic: true,
          })
        )
        .setAuthor({
          name: `${server.name  }`,
          iconURL: server.iconURL({
            dynamic: true,
          }),
        })
        .setTitle(`Información de ${server.name}`)
        .setURL(process.env.URL_INVITE)
        .setDescription(`${server.description} \n **ID:** \`${server.id}\``)
        .addFields(
          {
            name: "🎂 Creación del servidor",
            value: `<t:${process.env.CREATION_SERVER}>`,
            inline: false,
          },
          {
            name: "🎉 Miembros",
            value: `\`${server.memberCount}\``,
            inline: true,
          },
          {
            name: "🌈 Roles",
            value: `\`${server.roles.cache.size}\``,
            inline: true,
          },
          {
            name: "📺 Canales",
            value: `\`${server.channels.cache.size}\``,
            inline: true,
          },
          {
            name: "😂 Emojis",
            value: `\`${server.emojis.cache.size}\``,
            inline: true,
          },
          {
            name: "💎 Boosts",
            value: `\`${server.premiumSubscriptionCount}\``,
            inline: true,
          },
          {
            name: "🚀 Nivel de boost",
            value: `\`${server.premiumTier}\``,
            inline: true,
          },
          {
            name: "🤖 Bot oficial",
            value: `<@${client.user.id}>`,
          }
        )
        .setImage(
          server.bannerURL({
            dynamic: true,
          })
        )
        .setFooter({
          text: `${server.name} Network.`,
          iconURL: server.iconURL({
            dynamic: true,
          }),
        });

      interaction.reply({
        embeds: [embed],
        ephemeral: false, // Para mostrar el mensaje solo al usuario que ejecutó el comando
      });
    } catch (e) {
      interaction.reply({
        content: `❌ | **¡Ha ocurrido un error al ejecutar este comando!**`,
        ephemeral: true,
      });
      console.log(e);
    }
  },
};

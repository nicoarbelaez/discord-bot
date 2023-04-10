const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Ver la información de un usuario")
    .addUserOption((option) =>
      option.setName("target").setDescription("¿De quién quieres ver la información?")
    )
    .setDMPermission(false),

  async execute(client, interaction, prefix) {
    try {
      function getPrefixNickname(nickname) {
        if (!nickname) return "No tiene";
        const start = nickname.indexOf("[");
        const end = nickname.indexOf("]");
        const prefix = nickname.substring(start + 1, end);

        return prefix;
      }
      const targetMember = interaction.options.getMember("target");
      const infoMember = targetMember || interaction.member;
      // Roles del usuario
      const roles = infoMember.roles.cache;
      const rolesID = [];

      roles.sort((a, b) => {
        return b.rawPosition - a.rawPosition;
      });

      roles.forEach((role) => {
        if (role.color !== 0) {
          rolesID.push(`<@&${role.id}>`); // Convierto el ID del rol en mencion
        }
      });
      // Estado del usuario
      const status = {
        online: "🟢 En línea",
        idle: "🟡 Ausente",
        dnd: "🔴 No molestar",
        offline: "⚫️ Desconectado",
      };

      // Crear un embed
      const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setThumbnail(
          infoMember.user.avatarURL({
            dynamic: true,
          })
        )
        .setAuthor({
          name: `${infoMember.user.tag}`,
          iconURL: infoMember.user.avatarURL({
            dynamic: true,
          }),
        })
        .setTitle(`Información de ${infoMember.user.username}`)
        .setURL(process.env.URL_INVITE)
        .addFields(
          {
            name: `📅 Miembro desde`,
            value: `<t:${parseInt(infoMember.joinedTimestamp / 1000)}:D>`,
            inline: true,
          },
          {
            name: `🎂 Cuenta creada`,
            value: `<t:${parseInt(infoMember.user.createdTimestamp / 1000)}:D>`,
            inline: true,
          },
          {
            name: `🔒 ID`,
            value: `\`${infoMember.user.id}\``,
          },
          {
            name: `📌 Prefijo`,
            value: `\`${getPrefixNickname(infoMember.nickname)}\``,
            inline: true,
          },
          {
            name: `🤭 Nickname`,
            value: `\`${infoMember.nickname || infoMember.user.username}\``,
            inline: true,
          },
          {
            name: `🤖 Bot`,
            value: `\`${infoMember.user.bot ? "Sí" : "No"}\``,
            inline: true,
          },
          {
            name: `🌈 Roles`,
            value: rolesID.join(", ") || "No tiene",
            inline: false,
          },
          {
            name: `📢 Estado`,
            value: `\`${
              infoMember.presence ? status[infoMember.presence.status] : status["offline"]
            }\``,
            inline: true,
          }
        )
        .setImage(
          infoMember.user.bannerURL({
            dynamic: true,
          })
        )
        .setFooter({
          text: `${interaction.member.guild.name} Network.`,
          iconURL: interaction.member.guild.iconURL({
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

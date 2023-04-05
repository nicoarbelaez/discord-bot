const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Ver la información de un usuario")
    .addUserOption((option) =>
      option.setName("objetivo").setDescription("¿De quién quieres ver la información?")
    ),

  async execute(client, interaction, prefix) {
    try {
      function getPrefixNickname(nickname) {
        if (!nickname) return "No tiene";
        const start = nickname.indexOf("[");
        const end = nickname.indexOf("]");
        const prefix = nickname.substring(start + 1, end);

        return prefix;
      }
      const targetMember = interaction.options.getMember("objetivo");
      const infoMember = targetMember || interaction.member;

      const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setThumbnail(
          infoMember.user.avatarURL({
            dynamic: true,
          })
        )
        .setAuthor({
          name: `${infoMember.user.username}#${infoMember.user.discriminator}`,
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
            name: `ID`,
            value: `${infoMember.user.id}`,
          },
          {
            name: `Prefijo`,
            value: `${getPrefixNickname(infoMember.nickname)}`,
            inline: true,
          },
          {
            name: `Nickname`,
            value: `${infoMember.nickname || infoMember.user.username}`,
            inline: true,
          },
          {
            name: `Bot`,
            value: `${infoMember.user.bot ? "Sí" : "No"}`,
            inline: true,
          },
          {
            name: `Roles`,
            value: `${infoMember.roles.cache.size - 1}`,
            inline: true,
          },
          {
            name: `Estado`,
            value: `${
              infoMember.presence
                ? "🟢 " + infoMember.presence.status || "🔴 Offline"
                : "🔴 Offline"
            }`,
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
        ephemeral: false,
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

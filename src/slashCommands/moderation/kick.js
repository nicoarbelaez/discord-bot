const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { colors, server } = require(`${process.cwd()}/config/config.json`);

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Expulsar a un usuario")
    .addUserOption((option) =>
      option.setName("target").setDescription("El usuario que quieres expulsar").setRequired(true)
    )
    .addStringOption((option) => option.setName("razon").setDescription("Razón").setRequired(true))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(client, interaction, prefix) {
    try {
      const TARGET_MEMBER = interaction.options.getMember("target");
      const reason = interaction.options.getString("razon");
      const embed = new EmbedBuilder()
        .setColor(colors.moderation.kick)
        .setTimestamp()
        .setThumbnail(TARGET_MEMBER.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setFooter({
          text: `${interaction.member.guild.name} Network.`,
          iconURL: interaction.member.guild.iconURL({
            dynamic: true,
          }),
        });

      let menssageContent = `¡Intentaste expulsar ha ${TARGET_MEMBER}`;
      let errorKick = false;

      if (TARGET_MEMBER.id === interaction.user.id) {
        embed.setTitle("🤦‍♂️ ¡No puedes autoexpulsarte!");
        embed.setDescription("¿Qué estás pensando?.. 🤣");
        errorKick = true;
      }

      if (TARGET_MEMBER.id === client.user.id) {
        embed.setTitle("🤬 ¡No puedes expulsarme a mí!");
        embed.setDescription("¿Qué te pasa?... 😠");
        errorKick = true;
      }

      if (
        TARGET_MEMBER.roles.highest.position >= interaction.member.roles.highest.position &&
        !errorKick
      ) {
        embed.setTitle("😲 ¡No puedes expulsar a alguien con más o igual rango que tú!");
        embed.setDescription("¿Quién te crees que eres?... 😡");
        errorKick = true;
      }

      if (!TARGET_MEMBER.bannable && !errorKick) {
        embed.setTitle("😥 ¡No tengo permiso para expulsar a este usuario!");
        embed.setDescription("¿Por qué me lo pones difícil?... 😮‍💨");
        errorKick = true;
      }

      if (!embed.data.title && !errorKick) {
        const channelLogsModeration = interaction.guild.channels.cache.get(
          server.channel.logModeration
        );
        embed.setTitle(`⏏️ [KICK] ${TARGET_MEMBER.user.tag}`).addFields(
          {
            name: "👤 Usuario",
            value: `${TARGET_MEMBER}`,
            inline: true,
          },
          {
            name: "👮 Moderador",
            value: `${interaction.user}`,
            inline: true,
          },
          {
            name: "📝 Razón",
            value: reason,
            inline: false,
          }
        );

        await TARGET_MEMBER.kick({ reason: reason });

        channelLogsModeration.send({
          content: `${interaction.user} has expulsado a ${TARGET_MEMBER}`,
          embeds: [embed],
        });
        menssageContent = "";
      }

      interaction.reply({
        content: menssageContent,
        embeds: [embed],
        ephemeral: true,
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

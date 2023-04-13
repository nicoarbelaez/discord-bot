const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { colors, server } = require(`${process.cwd()}/config/config.json`);

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Banear a un usuario")
    .addUserOption((option) =>
      option.setName("target").setDescription("El usuario que quieres banear").setRequired(true)
    )
    .addStringOption((option) => option.setName("razon").setDescription("Razón").setRequired(true))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(client, interaction, prefix) {
    try {
      const TARGET_MEMBER = interaction.options.getMember("target");
      const reason = interaction.options.getString("razon");
      const embed = new EmbedBuilder()
        .setColor(colors.moderation.ban)
        .setTimestamp()
        .setThumbnail(TARGET_MEMBER.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setFooter({
          text: `${interaction.member.guild.name} Network.`,
          iconURL: interaction.member.guild.iconURL({
            dynamic: true,
          }),
        });

      let menssageContent = `¡Intentaste banear ha ${TARGET_MEMBER}`;
      let errorBan = false;

      if (TARGET_MEMBER.id === interaction.user.id) {
        embed.setTitle("😱 ¡No puedes banearte a ti mismo!");
        embed.setDescription("¿Estás loco o qué?... 😂");
        errorBan = true;
      }

      if (TARGET_MEMBER.id === client.user.id) {
        embed.setTitle("😡 ¡No puedo banearme a mi mismo!");
        embed.setDescription("¿Qué te crees que soy?... 😒");
        errorBan = true;
      }

      if (
        TARGET_MEMBER.roles.highest.position >= interaction.member.roles.highest.position &&
        !errorBan
      ) {
        embed.setTitle("😮 ¡No puedes banear a un usuario con un rol igual o superior al tuyo!");
        embed.setDescription("¿Te crees más que los demás?... 😤");
        errorBan = true;
      }

      if (!TARGET_MEMBER.bannable && !errorBan) {
        embed.setTitle("😓 ¡No puedo banear a este usuario!");
        embed.setDescription("¿Por qué me pones en esta situación?... 😭");
        errorBan = true;
      }

      if (!embed.data.title && !errorBan) {
        const channelLogsModeration = interaction.guild.channels.cache.get(
          server.channel.logModeration
        );
        embed.setTitle(`🚫 [BAN] ${TARGET_MEMBER.user.tag}`).addFields(
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

        await TARGET_MEMBER.ban({ reason: reason });

        channelLogsModeration.send({
          content: `${interaction.user} has baneado a ${TARGET_MEMBER}`,
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

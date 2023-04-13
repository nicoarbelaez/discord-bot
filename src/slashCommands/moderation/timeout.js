const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { colors, server } = require(`${process.cwd()}/config/config.json`);

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Aislar temporalmente a un usuario")
    .addUserOption((option) =>
      option.setName("target").setDescription("El usuario que quieres Aislar").setRequired(true)
    )
    .addStringOption((option) => option.setName("razon").setDescription("Razón").setRequired(true))
    .addIntegerOption((option) =>
      option.setName("tiempo").setDescription("Tiempo de aislamiento").setRequired(true).addChoices(
        {
          name: "60 Segundos",
          value: 60,
        },
        {
          name: "5 Minutos",
          value: 300,
        },
        {
          name: "10 Minutos",
          value: 600,
        },
        {
          name: "1 hora",
          value: 3600,
        },
        {
          name: "1 día",
          value: 86400,
        },
        {
          name: "1 semana",
          value: 604800,
        }
      )
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(client, interaction, prefix) {
    try {
      const TARGET_MEMBER = interaction.options.getMember("target");
      const reason = interaction.options.getString("razon");
      const time = interaction.options.getInteger("tiempo");
      const embed = new EmbedBuilder()
        .setColor(colors.moderation.timeout)
        .setTimestamp()
        .setThumbnail(TARGET_MEMBER.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setFooter({
          text: `${interaction.member.guild.name} Network.`,
          iconURL: interaction.member.guild.iconURL({
            dynamic: true,
          }),
        });

      let menssageContent = `¡Intentaste aislar temporalmente ha ${TARGET_MEMBER}`;
      let errorTimeOut = false;

      if (TARGET_MEMBER.id === interaction.user.id) {
        embed.setTitle("😳 ¡No puedes aislarte temporalmente a ti mismo!");
        embed.setDescription("¿Qué sentido tiene eso?.. 🤔");
        errorTimeOut = true;
      }

      if (TARGET_MEMBER.id === client.user.id) {
        embed.setTitle("😠 ¡No puedes aislarme temporalmente a mí mismo!");
        embed.setDescription("¿Qué te has creído?... 😑");
        errorTimeOut = true;
      }

      if (
        TARGET_MEMBER.roles.highest.position >= interaction.member.roles.highest.position &&
        !errorTimeOut
      ) {
        embed.setTitle(
          "😲 ¡No puedes aislar temporalmente a un usuario con un rol igual o superior al tuyo!"
        );
        embed.setDescription("¿No respetas la jerarquía?... 😡");
        errorTimeOut = true;
      }

      if (!TARGET_MEMBER.moderatable && !errorTimeOut) {
        embed.setTitle("😥 ¡No puedo aislar temporalmente a este usuario!");
        embed.setDescription("¿Por qué me lo pides si sabes que no puedo?... 😢");
        errorTimeOut = true;
      }

      if (!embed.data.title && !errorTimeOut) {
        const channelLogsModeration = interaction.guild.channels.cache.get(
          server.channel.logModeration
        );

        embed.setTitle(`⏳ [TIME OUT] ${TARGET_MEMBER.user.tag}`).addFields(
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
            name: "⏱️ Tiempo",
            value: `\`${time}s\``,
            inline: true,
          },
          {
            name: "📝 Razón",
            value: reason,
            inline: false,
          }
        );

        await TARGET_MEMBER.timeout(time * 1000, reason);

        channelLogsModeration.send({
          content: `${interaction.user} has aislado temporalmente a ${TARGET_MEMBER}`,
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

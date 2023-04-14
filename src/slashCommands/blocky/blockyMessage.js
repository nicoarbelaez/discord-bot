const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("blocky-message")
    .setDescription("Envía un mensaje de blocky a un canal.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Canal donde se enviará el mensaje")
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("message-id").setDescription("ID del mensaje a enviar").setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel-location")
        .setDescription("Canal donde está el mensaje")
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction, prefix) {
    try {
      const channel = interaction.options.getChannel("channel");
      const channelLocation =
        interaction.options.getChannel("channel-location") || interaction.channel;
      const messageID = interaction.options.getString("message-id");

      const message = await channelLocation.messages.fetch(messageID).catch((e) => {});

      if (!message) {
        return interaction.reply({
          content: `❌ | **¡El mensaje no existe en ${channelLocation}!**`,
          ephemeral: true,
        });
      }

      const menssageContent = message.content.replaceAll("\\", "");

      await channel.send({
        content: menssageContent,
        files: message.attachments.map((attachment) => attachment.url),
      });

      await interaction.reply({
        content: `Mensaje enviado en ${channel}`,
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

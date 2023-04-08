const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Envía un mensaje de blocky a un canal")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Canal donde se enviará el mensaje")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((option) =>
    option.setName("message-id").setDescription("ID del mensaje que se enviará").setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel-location")
        .setDescription("Canal donde se encuentra el mensaje")
        .addChannelTypes(ChannelType.GuildText)
        // .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction, prefix) {
    try {
      const channel = interaction.options.getChannel("channel");
      const channelLocation = interaction.options.getChannel("channel-location") || interaction.channel;
      const messageID = interaction.options.getString("message-id");

      const message = await channelLocation.messages.fetch(messageID).catch((e) => {});

      if (!message) {
        return interaction.reply({
          content: `❌ | **¡El mensaje no existe en ${channelLocation}!**`,
          ephemeral: true,
        });
      }

      await channel.send({
        content: message.content,
        files: message.attachments.map((attachment) => attachment.url),
      })

      return interaction.reply({
        content: `Mensaje enviado al canal ${channel}`,
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

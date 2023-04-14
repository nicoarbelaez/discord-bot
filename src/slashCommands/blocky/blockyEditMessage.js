const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("blocky-edit-message")
    .setDescription("Edite un mensaje bloqueado enviado a un canal.")
    .addChannelOption((option) =>
      option
        .setName("channel-location")
        .setDescription("Canal donde está el mensaje a editar")
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("message-id").setDescription("ID del mensaje a editar").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("message-id-new").setDescription("ID del mensaje nuevo").setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel-location-new")
        .setDescription("Canal donde está el mensaje nuevo")
        .addChannelTypes(ChannelType.GuildText)
    )
    .addBooleanOption((option) =>
      option.setName("copy-message").setDescription("Copiar el contenido del mensaje a un canal")
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction, prefix) {
    try {
      const channelLocation = interaction.options.getChannel("channel-location");
      const messageID = interaction.options.getString("message-id");
      const channelLocationNew =
        interaction.options.getChannel("channel-location-new") || interaction.channel;
      const messageIDNew = interaction.options.getString("message-id-new");
      const copyMessage = interaction.options.getBoolean("copy-message");

      const message = await channelLocation.messages.fetch(messageID).catch((e) => {});

      if (!message) {
        return interaction.reply({
          content: `❌ | **¡El mensaje no existe en ${channelLocation}!**`,
          ephemeral: true,
        });
      }

      if(message.author.id !== client.user.id) {
        return interaction.reply({
          content: `❌ | **¡El mensaje no fue enviado por el bot!**`,
          ephemeral: true,
        });
      }

      if (copyMessage) {
        return await interaction.reply({
          content: `Si quieres editar el mensaje pon \`copy-message\` en \`false\` \n\`\`\`\n${message.content} \n\`\`\``,
          files: message.attachments.map((attachment) => attachment.url),
          ephemeral: true,
        });
      }
      
      const messageNew = await channelLocationNew.messages.fetch(messageIDNew).catch((e) => {});

      if (!messageNew) {
        return interaction.reply({
          content: `❌ | **¡El mensaje no existe en ${channelLocationNew}!**`,
          ephemeral: true,
        });
      }

      const menssageContent = messageNew.content.replaceAll("\\", "");

      await message.edit({
        content: menssageContent,
        files: messageNew.attachments.map((attachment) => attachment.url),
      });

      await interaction.reply({
        content: `Mensaje editado en ${channelLocation}`,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel("Ver mensaje")
              .setURL(message.url)
          ),
        ],
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

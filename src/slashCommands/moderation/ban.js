const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Banear a un usuario")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction, prefix) {
    try {
      interaction.reply({
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

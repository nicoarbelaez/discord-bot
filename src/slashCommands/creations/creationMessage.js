const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("mensaje")
    .setDescription("Recarga los archivos el bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction, prefix) {
    try {

      interaction.reply({
        content: message,
        ephemeral: true
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
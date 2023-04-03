const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder().setDescription("Muestra el ping del bot"),
  async execute(client, interaction, prefix) {
    return interaction.reply({
      content: `🏓 | **¡Mi ping es de \`${client.ws.ping}ms\`!**`,
    });
  },
};

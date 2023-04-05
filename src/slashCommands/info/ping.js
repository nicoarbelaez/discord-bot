const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder().setDescription("Muestra el ping del bot"),
  async execute(client, interaction, prefix) {
    return interaction.reply({
      content: `🏓 | **¡Qué maravilla!** Mi ping es de **${client.ws.ping}ms!** ¡Estoy súper rápido y listo para la acción! 😎`,
    });
  },
};

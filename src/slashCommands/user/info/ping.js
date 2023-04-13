const { SlashCommandBuilder } = require("discord.js");
const { ping } = require(`${process.cwd()}/config/messageBlocky.json`);

module.exports = {
  CMD: new SlashCommandBuilder().setDescription("Muestra el ping del bot").setDMPermission(false),
  async execute(client, interaction, prefix) {
    let message = ping[Math.floor(Math.random() * ping.length)];
    message = message.replace("{ping}", client.ws.ping);

    return interaction.reply({
      content: message,
    });
  },
};

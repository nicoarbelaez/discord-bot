const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const messageBlocky = require("./messageBlocky.json");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Envía un mensaje de blocky a un canal")
    .addChannelOption((option) =>
      option.setName("channel").setDescription("Canal donde se enviará el mensaje")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction, prefix) {
    try {
      const channel = interaction.options.getChannel("channel") || interaction.channel;
      const mention = messageBlocky.menssages[0].mention;
      const message = messageBlocky.menssages[0].content;

      await channel.send(`${mention}\n${message}`);
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

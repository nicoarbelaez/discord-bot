const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setDescription("Recarga los archivos el bot")
    .addStringOption((option) =>
      option.setName("modulo").setDescription("Módulo a recargar").addChoices(
        {
          name: "Commands",
          value: "commands",
        },
        {
          name: "Events",
          value: "events",
        },
        {
          name: "SlashCommands",
          value: "slashcommands",
        },
        {
          name: "Handlers",
          value: "handlers",
        }
      )
    ),

  async execute(client, interaction, prefix) {
    let args = interaction.options.getString("modulo");
    let option = "Commands, Events, SlashCommands y Handlers";

    try {
      switch (args?.toLowerCase()) {
        case "commands":
        case "command":
        case "comandos":
        case "comando":
          {
            option = "Commands";
            await client.loadCommands();
          }
          break;
        case "events":
        case "event":
        case "eventos":
        case "evento":
          {
            option = "Events";
            await client.loadEvents();
          }
          break;
        case "slashcommands":
        case "slashcommand":
        case "slashcomandos":
        case "slashcomando":
        case "slash":
        case "slashs":
          {
            option = "SlashCommands";
            await client.loadSlashCommands();
          }
          break;
        case "handlers":
        case "handler": {
          option = "Handlers";
          await client.loadHandlers();
        }
        default:
          await client.loadHandlers();
          await client.loadEvents();
          await client.loadSlashCommands();
          await client.loadCommands();
          break;
      }

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .addFields({
              name: `✅ | **${option} recargados**`,
              value: `> **${option} recargados correctamente**`,
            })
            .setColor(process.env.COLOR),
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

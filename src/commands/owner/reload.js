const { EmbedBuilder } = require("discord.js");

module.exports = {
  DESCRIPTION: "Recarga un comando",
  OWNER: true,
  async execute(client, message, args, prefix) {
    let option = "Commands, Events, SlashCommands y Handlers";

    try {
      switch (args[0]?.toLowerCase()) {
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

      message.reply({
        embeds: [
          new EmbedBuilder()
            .addFields({
              name: `✅ | **${option} recargados**`,
              value: `> **${option} recargados correctamente**`,
            })
            .setColor(process.env.COLOR),
        ],
      });
    } catch (e) {
      message.reply({ content: `❌ | **¡Ha ocurrido un error al ejecutar este comando!**` });
      console.log(e);
    }
  },
};

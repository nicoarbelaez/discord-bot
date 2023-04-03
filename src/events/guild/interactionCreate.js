module.exports = async (client, interaction) => { // Esto es para los slash commands
  if (!interaction.guild || !interaction.channel) return;

  const COMMAND = client.slashCommands.get(interaction?.commandName);

  if (COMMAND) {
    if (COMMAND.OWNER) {
      // Comprueba si el usuario es el propietario del bot
      const OWNER = process.env.OWNER_IDS.split(", ");
      if (!OWNER.includes(interaction.user.id)) {
        return interaction.reply({
          content: `❌ | ${interaction.user}, **¡No tienes permiso para ejecutar este comando!**`,
        });
      }
    }

    if (COMMAND.BOT_PERMISSIONS) {
      // Comprueba si el bot tiene los permisos necesarios
      if (!interaction.guild.members.me.permissions.has(COMMAND.BOT_PERMISSIONS)) {
        return interaction.reply({
          content: ```
            ❌ | ${interaction.user}, **¡No tengo permisos para ejecutar este comando!**
            ${COMMAND.BOT_PERMISSIONS.map((botperm) => `\`${botperm}\``).join(", ")}
            ```,
        });
      }
    }

    if (COMMAND.PERMISSIONS) {
      // Comprueba si el usuario tiene los permisos necesarios
      if (!interaction.member.permissions.has(COMMAND.PERMISSIONS)) {
        return interaction.reply({
          content: ```
            ❌ | ${interaction.user}, **¡No tienes permisos para ejecutar este comando!**
            ${COMMAND.PERMISSIONS.map((perm) => `\`${perm}\``).join(", ")}
            ```,
        });
      }
    }

    try {
      COMMAND.execute(client, interaction, "/");
    } catch (e) {
      interaction.reply({
        content: `❌ | ${interaction.user}, **¡Ha ocurrido un error al ejecutar este comando!**`,
      });
      console.log(e);
      return;
    }
  }
};

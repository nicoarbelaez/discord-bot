module.exports = async (client, message) => { // Esto es para los comandos normales
  /**
   * message.guild: Si el mensaje fue enviado en un servidor
   * message.channel: Si el mensaje fue enviado en un canal
   * message.author.bot: Si el autor del mensaje es un bot
   */
  if (!message.guild || !message.channel || message.author.bot) return;

  if (!message.content.startsWith(process.env.PREFIX)) return;

  const ARGS = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const CMD = ARGS?.shift()?.toLowerCase();
  console.log(`cmd: ${CMD} \nargs: ${ARGS}`);

  const COMMAND =
    client.commands.get(CMD) ||
    client.commands.find((c) => c.ALIASES && c.ALIASES.includes(CMD));

  if (COMMAND) {
    if (COMMAND.OWNER) {
      // Comprueba si el usuario es el propietario del bot
      const OWNER = process.env.OWNER_IDS.split(", ");
      if (!OWNER.includes(message.author.id)) {
        return message.reply({
          content: `❌ | ${message.user}, **¡No tienes permiso para ejecutar este comando!**`,
        });
      }
    }

    if (COMMAND.BOT_PERMISSIONS) {
      // Comprueba si el bot tiene los permisos necesarios
      if (!message.guild.members.me.permissions.has(COMMAND.BOT_PERMISSIONS)) {
        return message.reply({
          content: ```
            ❌ | ${message.user}, **¡No tengo permisos para ejecutar este comando!**
            ${COMMAND.BOT_PERMISSIONS.map((botperm) => `\`${botperm}\``).join(", ")}
            ```,
        });
      }
    }

    if (COMMAND.PERMISSIONS) {
      // Comprueba si el usuario tiene los permisos necesarios
      if (!message.member.permissions.has(COMMAND.PERMISSIONS)) {
        return message.reply({
          content: ```
            ❌ | ${message.user}, **¡No tienes permisos para ejecutar este comando!**
            ${COMMAND.PERMISSIONS.map((perm) => `\`${perm}\``).join(", ")}
            ```,
        });
      }
    }

    try {
      COMMAND.execute(client, message, ARGS, process.env.PREFIX);
    } catch (e) {
      message.reply({
        content: `❌ | ${message.user}, **¡Ha ocurrido un error al ejecutar este comando!**`,
      });
      console.log(e);
      return;
    }
  }
};

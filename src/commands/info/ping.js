module.exports = {
  DESCRIPTION: "Muestra el ping del bot",
  ALIASES: ["pong"],
  async execute(client, message, args, prefix) {
    
    return message.reply({
      content: `🏓 | **¡Qué maravilla!** Mi ping es de **${client.ws.ping}ms!** ¡Estoy súper rápido y listo para la acción! 😎`,
    });
  },
};

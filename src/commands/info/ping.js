module.exports = {
  DESCRIPTION: "Muestra el ping del bot",
  ALIASES: ["pong"],
  async execute(client, message, args, prefix) {
    
    return message.reply({
      content: `🏓 | ${message.author} **¡Mi ping es de \`${client.ws.ping}ms\`!**`,
    });
  },
};

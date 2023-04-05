const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Recarga los archivos el bot")
    .addStringOption((option) =>
      option.setName("title").setDescription("Titulo del embed").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("description").setDescription("Descripción del embed").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(client, interaction, prefix) {
    try {
      const title = interaction.options.getString("title");
      const description = interaction.options.getString("description");
      const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setThumbnail("https://i.imgur.com/XRC87so.png")
        .setAuthor({
          name: ".setAuthor | name:", // 256 caracteres
          iconURL: "https://i.imgur.com/XRC87so.png",
          url: "https://discordjs.guide/popular-topics/embeds.html#notes",
        })
        .setURL("https://discordjs.guide/popular-topics/embeds.html#notes")
        .setTitle(title) // 256 caracteres
        .setDescription(description) // 4096 caracteres
        .addFields(
          {
            name: ".addFields | name:", // 256 caracteres
            value: ".addFields | value:", // 1024 caracteres
          },
          {
            name: ".addFields(2) | inline:(2)", // 256 caracteres
            value: ".addFields(2) | inline:(2)", // 1024 caracteres
            inline: true,
          },
          {
            name: ".addFields(3) | inline:(3)", // 256 caracteres
            value: ".addFields(3) | inline:(3)", // 1024 caracteres
            inline: true,
          }
        ) // 25 campos
        .setImage("https://i.imgur.com/XRC87so.png")
        .setFooter({
          text: `${interaction.member.guild.name} Network.`, // 2048 caracteres
          iconURL: interaction.member.guild.iconURL(),
        })
        .setTimestamp();

      interaction.reply({
        embeds: [embed], // 6000 caracteres | 10 embeds
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

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { server } = require(`${process.cwd()}/config/config.json`);

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("sugerencia")
    .setDescription("Envía una sugerencia al servidor")
    .addStringOption((option) =>
      option.setName("contenido").setDescription("Contenido de la sugerencia").setRequired(true)
    )
    .setDMPermission(false),
  async execute(client, interaction, prefix) {
    try {
      function getEmoji(id) {
        return client.emojis.cache.get(id);
      }

      function validateForbiddenContent(str) {
        const regexMention = /<[#@]&?[0-9]+>/;
        const regexUrl = /(\w+:\/\/)\w+\.?\w+/i;

        const regex = new RegExp(`${regexMention.source}|${regexUrl.source}`);
        return regex.test(str);
      }

      const content = interaction.options.getString("contenido");
      const channelSuggestion = client.channels.cache.get(server.channel.suggestion);

      const indifferent = getEmoji("1095509257509687487");
      const yes = getEmoji("836021627795537980");
      const no = getEmoji("836021625353797672");

      const embed = new EmbedBuilder().setColor(process.env.COLOR).setFooter({
        text: `${interaction.member.guild.name} Network | usa /sugerencia para enviar una sugerencia.`,
        iconURL: interaction.member.guild.iconURL({
          dynamic: true,
        }),
      });

      // Condicionales
      if (content.length > 1024) {
        embed.setTitle(" ¡Oh no! 😱 Tu sugerencia es demasiado larga!");
        embed.setDescription(
          "Por favor, intenta reducir la cantidad de caracteres. Sé breve y conciso. 🙏"
        );
        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (content.length < 20) {
        embed.setTitle(" ¡Ups! 😅 Tu sugerencia es demasiado corta!");
        embed.setDescription(
          "Por favor, intenta aumentar la cantidad de caracteres. Explica tu idea con más detalle. 🙌"
        );
        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (
        content.includes("@everyone") ||
        content.includes("@here") ||
        validateForbiddenContent(content)
      ) {
        embed.setTitle(
          " ¡Ay! 😓 Tu sugerencia contiene contenido prohibido (menciones o enlaces)!"
        );
        embed.setDescription(
          "Por favor, intenta no agregar este tipo de contenido. <:pepe_angry:808137735721975848>"
        );
        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // Embed
      embed.setTitle("📝 ¡Nueva sugerencia!");
      embed.setThumbnail(
        interaction.user.avatarURL({
          dynamic: true,
        })
      );
      embed.setDescription(`${content}`).addFields(
        {
          name: "Autor",
          value: `${interaction.user}`,
          inline: true,
        },
        {
          name: "ID",
          value: `\`${interaction.user.id}\``,
          inline: true,
        },
        {
          name: "Reacciones",
          value: `\n${yes} Apoyar \n${indifferent} Indiferente \n${no} Desacuerdo`,
        }
      );

      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("comfirmSuggestion")
          .setStyle(ButtonStyle.Success)
          .setLabel("Confirmar"),

        new ButtonBuilder().setCustomId("cancelSuggestion").setStyle(ButtonStyle.Secondary).setLabel("Cancelar")
      );

      const reply = await interaction.reply({
        components: [button],
        embeds: [
          new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle("📝 ¿Estás seguro de enviar tu sugerencia?")
            .setDescription(
              `**Tu sugerencia:** ${content} \n\nTu sugerencia será enviada a ${channelSuggestion}.`
            ),
        ],
        ephemeral: true,
      });

      const collector = reply.createMessageComponentCollector();
      collector.on("collect", async (i) => {
        await i.deferUpdate();
        if (i.customId === "comfirmSuggestion") {

          // Envio de la sugerencia
          const message = await channelSuggestion.send({ embeds: [embed] });
          // const urlSuggestions = `https://discord.com/channels/${interaction.guild.id}/${channelSuggestion.id}/${message.id}`;
          const urlSuggestions = message.url;
          await message.edit({
            embeds: [
              embed.setDescription(
                `${content} \n\nEnlace de la sugerencia: [Click aquí](${urlSuggestions})`
              ),
            ],
          });

          // Reacciones
          message.react(yes);
          message.react(indifferent);
          message.react(no);

          // Mensaje de confirmacion
          await i.editReply({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Link)
                  .setLabel("Ver sugerencia")
                  .setURL(urlSuggestions)
              ),
            ],
            embeds: [
              new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setTitle("📝 ¡Sugerencia enviada!")
                .setDescription(
                  `Tu sugerencia ha sido enviada a ${channelSuggestion}.`
                ),
            ],
          });
        }else if (i.customId === "cancelSuggestion") {

          await i.editReply({
            components: [],
            embeds: [
              new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setTitle("📝 ¡Sugerencia cancelada!")
                .setDescription(
                  `Tu sugerencia ha sido cancelada.`
                ),
            ],
          });
        }
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

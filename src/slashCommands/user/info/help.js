const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Muestra ayuda sobre los comandos del bot.")
    .setDMPermission(false),

  async execute(client, interaction, prefix) {
    try {
      const ephemeralVisibility = interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers);
      const permissionsMember = interaction.member.permissions.toArray();
      const commandsClient = await client.application.commands.fetch();
      const commandList = [];

      // Filtrar los comandos que el usuario puede ejecutar
      for (const command of commandsClient.values()) {
        const defaultPermissions = command.permissions.manager.defaultMemberPermissions;

        let hasPermission = false;
        // Comprobar si el usuario tiene permisos para ejecutar el comando
        defaultPermissions?.toArray().forEach((permission) => {
          if (permissionsMember.includes(permission)) hasPermission = true;
        });
        const condition = !defaultPermissions || hasPermission;

        if (condition) commandList.push({ name: command.name, description: command.description });
      }

      const MAX_COMMANDS = 25;
      const fields = commandList.slice(0, MAX_COMMANDS).map((command) => {
        return {
          name: `\`/${command.name}\``,
          value: `📌 ${command.description}`,
          inline: true,
        };
      });
      if (commandList.length > MAX_COMMANDS) {
        fields.push({
          name: "`🔗 Más comandos`",
          value: `Hay \`${
            commandList.length - MAX_COMMANDS
          }\` comandos más. Puedes verlos en el panel de comandos de Discord.`,
        });
      }

      const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.avatarURL({
            dynamic: true,
          }),
        })
        .setTitle("🚀 Comandos 🚀")
        .setDescription("👉 Los comandos disponibles para ti son: 👇")
        .addFields(fields)
        .setFooter({
          text: `${interaction.member.guild.name} Network.`,
          iconURL: interaction.member.guild.iconURL({
            dynamic: true,
          }),
        })
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        ephemeral: ephemeralVisibility,
      });
    } catch (e) {
      console.log(e);
    }
  },
};

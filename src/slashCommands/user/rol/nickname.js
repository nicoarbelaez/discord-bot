const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("nickname")
    .setDescription("Actuliza apodo y prefijo del miembro (Usar sin argumentos para restablecer)")
    .addUserOption((option) =>
      option.setName("miembro").setDescription("Miembro a actualizar el prefijo")
    )
    .addStringOption((option) => option.setName("apodo").setDescription("Apodo a actualizar"))
    .addBooleanOption((option) => option.setName("reset").setDescription("Restablecer apodo"))
    .setDMPermission(false),
  async execute(client, interaction, prefix, config) {
    try {
      function convertNamePrefix(rolName, rolID) {
        const { prefixRoles } = config;

        const role = prefixRoles.find((r) => r.id === rolID);
        if (!role.prefix) {
          namePrefix = rolName.replace(/[a-z]/g, "");
          if (rolName.length < 8) {
            namePrefix = rolName;
          }
          return namePrefix;
        }

        return role.prefix;
      }

      async function setNickname() {
        const role = interaction.guild.roles.cache.get(roleHighestId);
        const prefix = convertNamePrefix(role.name, role.id);
        const newNickname = `[${prefix}] ${
          nickname || memberToChangeNickname.user.username
        }`.substring(0, 32);

        await memberToChangeNickname.setNickname(newNickname);
      }

      /*
       * Inicio de codigo
       */
      const targetMember = interaction.options.getMember("miembro");
      const member = interaction.member;
      const memberToChangeNickname = targetMember || member;
      const memberRoles = memberToChangeNickname._roles;
      const rolesID = config.prefixRoles.map((r) => r.id);

      const nickname = interaction.options.getString("apodo");

      // Obtenemos el id del rol más alto que sea válido para el prefix
      const validRolesIDs = await memberRoles.filter((r) => rolesID.includes(r));
      let roleHighestPosition = 0;
      let roleHighestId = null;
      validRolesIDs.forEach((validRoleID) => {
        const role = interaction.guild.roles.cache.get(validRoleID);
        if (role.position > roleHighestPosition) {
          roleHighestPosition = role.position;
          roleHighestId = role.id;
        }
      });

      // Verificamos si el miembro tiene permisos para cambiar el nickname de otros miembros
      if (targetMember) {
        if (!member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
          return interaction.reply({
            content: `❌ | No tienes permisos para cambiar el nickname de otros miembros. 😭`,
            ephemeral: true,
          });
        }
      }

      // Verificamos si el miembro es el propietario del bot
      const OWNER = process.env.OWNER_IDS.split(", ");
      if (OWNER.includes(memberToChangeNickname.id))
        return interaction.reply({
          content: `❌ | No puedes cambiar el nickname de este miembro. 😭`,
          ephemeral: true,
        });

      // Reiniciamos el nickname
      if (interaction.options.getBoolean("reset")) {
        await memberToChangeNickname.setNickname("");
        setNickname();
        return interaction.reply({
          content: `✅ | **¡Felicidades!** El nickname ha sido restablecido. ${memberToChangeNickname.user}😍\n`,
          ephemeral: false,
        });
      }

      // Verificamos si el miembro tinene un rol para usar como prefijo
      if (!roleHighestId) {
        // Si tiene un apodo se queda con el
        await memberToChangeNickname.setNickname(nickname || memberToChangeNickname.nickname);
        if (nickname) {
          return interaction.reply({
            content: `✅ | **¡Felicidades!** El nickname ha sido actualizado. ${memberToChangeNickname.user}😍\n`,
            ephemeral: false,
          });
        }

        return interaction.reply({
          content: `❌ | No hay un rango que pueda ser usado como prefijo. 😭\n`,
          ephemeral: true,
        });
      }

      setNickname();

      return interaction.reply({
        content: `✅ | **¡Felicidades!** El nickname ha sido actualizado. ${memberToChangeNickname.user}😍\n`,
        ephemeral: false,
      });
    } catch (e) {
      console.log(e);
      return interaction.reply({
        content: `❌ | **¡Qué pena!** No se pudo cambiar el nombre. 😭\n`,
        ephemeral: true,
      });
    }
  },
};

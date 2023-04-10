const { SlashCommandBuilder, Collection, PermissionFlagsBits } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("nickname")
    .setDescription("Actuliza apodo y prefijo del miembro (Usar sin argumentos para restablecer)")
    .addUserOption((option) =>
      option.setName("miembro").setDescription("Miembro a actualizar el prefijo")
    )
    .setDMPermission(false)
    .addStringOption((option) => option.setName("apodo").setDescription("Apodo a actualizar")),
  async execute(client, interaction, prefix) {
    try {
      /**
       * Obtiene los roles del miembro filtra los roles que no tienen
       * color (roles sin caracteristicas) y los ordena de mayor a menor
       * para obtener el rol más alto.
       * @returns {String} El rol más alto del miembro
       */
      async function getHighestRole(member) {
        // Obtenemos los roles del miembro
        const roles = await member.roles.cache;
        const arrayRoles = new Collection();

        roles.forEach((r) => {
          if (r.color !== 0) arrayRoles.set(r.rawPosition, r.name);
        });
        // Ordenamos el array de mayor a menor
        const sortedArray = Array.from(arrayRoles.keys()).sort((a, b) => b - a);
        const highestRole = arrayRoles.get(sortedArray[0]) ? arrayRoles.get(sortedArray[0]) : "";

        return highestRole;
      }
      /**
       * Convierte el nombre del rol en un prefijo
       * @param {String} name Nombre del rol
       * @returns {String} Prefijo del rol
       */
      function convertNamePrefix(name) {
        if (name === "") return name;

        let namePrefix = "";
        namePrefix = name.replace(/[a-z ]/g, "");

        if (name.length < 9) {
          namePrefix = name;
        }

        if (prefixes.hasOwnProperty(name)) {
          namePrefix = prefixes[name];
        }

        return "[" + namePrefix + "]";
      }
      /**
       * Obtiene el nombre del miembro y le agrega el prefijo
       * @param {*} member objeto del miembro
       * @returns {String} Nuevo apodo del miembro
       */
      async function getNickname(member) {
        const NICKNAME = interaction.options.getString("apodo")?.substring(0, 32);

        const prefix = convertNamePrefix(await getHighestRole(member));
        const nickname = NICKNAME ? NICKNAME : member.user.username;
        return `${prefix} ${nickname}`;
      }
      /**
       * Setea el nombre del miembro
       * @param {*} member objeto del miembro
       */
      async function setNickname(member) {
        const OWNER = process.env.OWNER_IDS.split(", ");
        if (!OWNER.includes(member.user.id)) {
          member.setNickname(await getNickname(member));
        }
      }

      const prefixes = {
        Moderador: "Mod",
        Developer: "Dev",
        "Nitro Booster": "Nitro",
      };

      const MEMBER = interaction.member; // Miembro que ejecuta el comando
      const TARGET_MEMBER = interaction.options.getMember("miembro"); // Miembro al que se le va a cambiar el nombre

      // Verifica si el miembro tiene permiso para cambiar el nombre de otros miembros
      if (TARGET_MEMBER) {
        if (!MEMBER.permissions.has(PermissionFlagsBits.ManageNicknames) || TARGET_MEMBER.user.bot)
          return interaction.reply({
            content: `❌ | **¡Lo siento mucho, pero no tienes permiso para cambiar el nombre de otros miembros!** 😢\nEl apodo de ${TARGET_MEMBER.user} se ha mantenido igual.`,
            ephemeral: true,
          });

        setNickname(TARGET_MEMBER);

        return interaction.reply({
          content: `✅ | **¡Qué bien!** El nombre de ${TARGET_MEMBER.user} ha sido actualizado. 😊`,
          ephemeral: false,
        });
      } // Fin de cambio de nombre de otro miembro

      // Cambia el nombre del miembro que ejecuta el comando
      setNickname(MEMBER);

      return interaction.reply({
        content: `✅ | **¡Felicidades!** Tu nombre ha sido actualizado. ${MEMBER.user}😍\n`,
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

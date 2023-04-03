const { SlashCommandBuilder, Collection } = require("discord.js");

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName("apodo")
    .setDescription("Actuliza el prefijo")
    .addUserOption((option) =>
      option.setName("miembro").setDescription("Miembro a actualizar el prefijo")
    )
    .addBooleanOption((option) =>
      option.setName("todos-los-mimbros").setDescription("Actulizar el apodo de todos los miembros")
    ),
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
        // Creamos un array con los roles y su posición
        roles.forEach((r) => {
          // Si el rol no es 0, se agrega al array
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

        // Si el nombre es menor a 9 caracteres, se retorna el nombre
        if (name.length < 9) {
          namePrefix = name;
        }
        // Si al final el nombre existe en el objeto, se retorna el valor
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
        const namePrefix = convertNamePrefix(await getHighestRole(member));
        const nameUser = member.user.username;
        return `${namePrefix} ${nameUser}`;
      }

      const prefixes = {
        Developer: "Dev",
        "Nitro Booster": "Nitro",
      };
      const OWNER = process.env.OWNER_IDS.split(", ");

      // TODOS LOS MIEMBROS ====================================== ("todos-los-miembros")(true)
      if (interaction.options.getBoolean("todos-los-mimbros")) {
        let countMemeberUpdatePrefix = 0;
        const arrayMembers = [];
        const members = await interaction.guild.members.fetch();
        members.forEach(async (member) => {
          const isBot = member.user.bot;
          const isOwner = OWNER.includes(member.user.id);
          if (!isOwner) {
            member.setNickname(await getNickname(member));
            arrayMembers.push(member.user.username);
            countMemeberUpdatePrefix++;
          }
        });
        console.log(arrayMembers);
        return interaction.reply({
          content: `✅ | **¡Se han actulizado ${countMemeberUpdatePrefix} apodos de los miembros!**\n`,
          ephemeral: true,
        });
      }

      if (!OWNER.includes(interaction.member.user.id))
        interaction.member.setNickname(await getNickname(interaction.member));

      return interaction.reply({
        content: `✅ | **¡Nombre actulizado ${interaction.user}!**\n`,
        ephemeral: true,
      });
    } catch (e) {
      console.log(e);
      return interaction.reply({
        content: `❌ | **¡No se pudo cambiar el nombre!**\n`,
        ephemeral: true,
      });
    }
  },
};

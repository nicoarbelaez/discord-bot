const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  PresenceUpdateStatus,
  Collection,
} = require("discord.js");
const BotUtils = require("./Utils");

// Se crea una clase que extiende a la clase Client de Discord.js
module.exports = class extends Client {
  // El constructor de la clase recibe un objeto con las opciones del cliente
  constructor(
    options = {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildEmojisAndStickers,
      ],
      partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
      ],
      allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: false,
      },

      presence: {
        activities: [{ name: process.env.STATUS, type: ActivityType[process.env.STATUS_TYPE] }],
        status: PresenceUpdateStatus.Online,
      },
    }
  ) {
    // Se llama al constructor de la clase padre
    super({
      ...options,
    });

    // Variables de la clase
    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.slashArray = [];

    this.utils = new BotUtils(this);
    this.tableClient = [];
    this.start();
  }

  async start() {
    await this.loadEvents();
    await this.loadHandlers();
    await this.loadCommands();
    await this.loadSlashCommands();

    this.login(process.env.BOT_TOKEN);
  }

  async loadCommands() {
    console.log(`(${process.env.PREFIX}) Loading commands...`.yellow);
    await this.commands.clear();

    const PATH_COMMANDS = await this.utils.loadFile("/src/commands");

    if (PATH_COMMANDS.length) {
      // Se recorre el array de comandos en los archivos
      PATH_COMMANDS.forEach((pathFile) => {
        const NAME_COMMAND = pathFile.split("\\").pop().split("/").pop().split(".")[0];
        let asset = "❌";
        try {
          const COMMAND = require(pathFile);
          /** Se crea una variable que almacena el nombre del comando usando el nombre del archivo
           *
           * @example  "src/commands/ping.js" => "ping"
           */
          COMMAND.NAME = NAME_COMMAND;

          if (NAME_COMMAND) {
            this.commands.set(NAME_COMMAND, COMMAND);
          }
          asset = "✅";
        } catch (e) {
          console.log(`Error loading command ${pathFile}:`.bgRed);
          console.log(e);
        }
        this.tableClient.push({
          type: "Commands",
          name: `${process.env.PREFIX}${NAME_COMMAND}`,
          asset: asset,
        });
      });
    }

    console.log(`(${process.env.PREFIX}) Loaded ${this.commands.size} commands!`.green);
  }

  async loadSlashCommands() {
    console.log(`(/) Loading slash commands...`.yellow);
    await this.slashCommands.clear();
    this.slashArray = [];

    const PATH_SLASH_COMMANDS = await this.utils.loadFile("src/slashCommands");

    if (PATH_SLASH_COMMANDS.length) {
      PATH_SLASH_COMMANDS.forEach((pathFile) => {
        let NAME_SLASH_COMMANDS = pathFile.split("\\").pop().split("/").pop().split(".")[0];
        let asset = "❌";
        try {
          const SLASH_COMMANDS = require(pathFile);

          // Se asigna el resultado del operador ternario a la propiedad CMD.name
          SLASH_COMMANDS.CMD.name = SLASH_COMMANDS.CMD.name || NAME_SLASH_COMMANDS;
          // Se reasigna el valor de NAME_SLASH_COMMANDS
          NAME_SLASH_COMMANDS = SLASH_COMMANDS.CMD.name;

          if (NAME_SLASH_COMMANDS) {
            this.slashCommands.set(NAME_SLASH_COMMANDS, SLASH_COMMANDS);
          }

          this.slashArray.push(SLASH_COMMANDS.CMD.toJSON());
          asset = "✅";
        } catch (e) {
          console.log(`Error loading slash command ${pathFile}:`.bgRed);
          console.log(e);
        }
        this.tableClient.push({
          type: "SlashCommands",
          name: `/${NAME_SLASH_COMMANDS}`,
          asset: asset,
        });
      });
    }

    console.log(`(/) Loaded ${this.slashCommands.size} slash commands!`.green);

    if (this?.application?.commands) {
      this.application.commands.set(this.slashArray);
      console.log(`(/) ${this.slashCommands.size} Published commands!`.green);
    }
  }

  async loadHandlers() {
    console.log(`(-) Loading handlers...`.yellow);

    const PATH_HANDLERS = await this.utils.loadFile("/src/handlers");

    if (PATH_HANDLERS.length) {
      PATH_HANDLERS.forEach((pathFile) => {
        const NAME_HANDLER = pathFile.split("\\").pop().split("/").pop().split(".")[0];
        let asset = "❌";
        try {
          require(pathFile)(this);
          asset = "✅";
        } catch (e) {
          console.log(`Error loading handlers ${pathFile}:`.bgRed);
          console.log(e);
        }
        this.tableClient.push({ type: "Handler", name: NAME_HANDLER, asset: asset });
      });
    }

    console.log(`(-) Loaded ${PATH_HANDLERS.length} handlers!`.green);
  }

  async loadEvents() {
    console.log(`(+) Loading events...`.yellow);

    const PATH_EVENTS = await this.utils.loadFile("src/events");
    this.removeAllListeners();

    if (PATH_EVENTS.length) {
      PATH_EVENTS.forEach((pathFile) => {
        const NAME_EVENT = pathFile.split("\\").pop().split("/").pop().split(".")[0];
        let asset = "❌";
        try {
          const EVENT = require(pathFile);
          /**
           * Un evento es el "ready"
           * .bind devuelve una función que cuando se ejecute, tendrá el valor de this establecido en el primer argumento que se le pase a bind.
           *  */
          this.on(NAME_EVENT, EVENT.bind(null, this));
          asset = "✅";
        } catch (e) {
          console.log(`Error loading events ${pathFile}:`.bgRed);
          console.log(e);
        }
        this.tableClient.push({ type: "Events", name: NAME_EVENT, asset: asset });
      });
    }

    console.log(`(+) Loaded ${PATH_EVENTS.length} events!`.green);
  }
};

// const { glob } = require("glob");
// const { promisify } = require("util");
// const proGlob = promisify(glob);
const glob = require("glob");

// Se crea una clase con el nombre de BotUtils
module.exports = class BotUtils {
  // El constructor de la clase recibe un objeto con las opciones del cliente
  constructor(client) {
    this.client = client;
  }

  // Se crea un metodo que se encarga de cargar los comandos
  async loadFile(driName) {
    // Se crea una variable que almacena los archivos de la carpeta
    // const FILES = await proGlob(`${process.cwd().replace(/\\/g, "/")}/${driName}/**/*.js`);
    const FILES = await glob.sync(`${process.cwd().replace(/\\/g, "/")}/${driName}/**/*.js`)
    // Se crea un bucle que recorre los archivos
    FILES.forEach((files) => delete require.cache[require.resolve(files)]);
    return FILES;
  }
};

module.exports = (client) => {
  process.removeAllListeners();

  process.on("unhandledRejection", (reason, promise) => {
    console.log("[ANTICRASH] - ERROR ENCONTRADO");
    console.log(`[ANTICRASH] - REASON: ${reason}`);
    console.log(promise)
  });

  process.on("uncaughtException", (error, origin) => {
    console.log("[ANTICRASH] - ERROR ENCONTRADO");
    console.log(`[ANTICRASH] - ERROR: ${error}`);
    console.log(origin)
  });

  process.on("uncaughtExceptionMonitor", (error, origin) => {
    console.log("[ANTICRASH] - ERROR ENCONTRADO");
    console.log(`[ANTICRASH] - ERROR: ${error}`);
    console.log(origin)
  });

  process.on("multipleResolves", () => {});
};

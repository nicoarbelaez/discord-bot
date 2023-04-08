module.exports = (client) => {
  console.log(`Session started as ${client.user.tag}!`.bold.blue);
  
  console.table(client.tableClient);
  //Publicamos los slash commands
  if (client?.application?.commands) {
    client.application.commands.set(client.slashArray);
    console.log(`(/) ${client.slashCommands.size} Published slash commands!`.green);
  }
};

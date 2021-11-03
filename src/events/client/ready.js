const Event = require("../../structures/Event");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "ready",
    });
  }

  run = async () => {
    console.log(
      `🤖 Bot ${this.client.user.username} logado com sucesso em ${this.client.guilds.cache.size} servidores com ${this.client.users.cache.size} usuários.`
    );
    this.client.registryCommands();
    await this.client.db.init();
    this.client.configureCommandsPermissions()
  };
};

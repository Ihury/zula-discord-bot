const { MessageEmbed } = require("discord.js");
const Event = require("../../structures/Event");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "guildMemberAdd",
    });
  }

  run = async (member) => {
    const guildDB =
      await this.client.db.guilds.findById(member.guild.id) ||
      new this.client.db.guilds({ _id: member.guild.id });

    member.roles.add(guildDB.cargos?.membro).catch(() => {});

    const embed = new MessageEmbed()
      .setColor("#00FF00")
      .setTitle("Bem-vindo ao servidor!")
      .setDescription(
        `Olá, ${member.user.username}! Seja bem-vindo ao servidor!`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    member.guild.channels.cache
      .get(guildDB.canais?.boas_vindas)?.send({ content: member.user.toString(), embeds: [embed] });
  };
};

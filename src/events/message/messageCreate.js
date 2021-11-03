const { MessageEmbed } = require("discord.js");
const Event = require("../../structures/Event");
const { Translate } = require("@google-cloud/translate").v2;
const translate = new Translate({
  keyFilename: "./keys/cloud_translate_api_key.json",
});
module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "messageCreate",
    });
  }

  run = async (message) => {
    if (message.reference?.guildId === "749846483636846592") {
      const content =
        message.content?.length &&
        message.content
          .replaceAll("@꒰🎮꒱ ୨୧  Jugadores", "")
          .replaceAll("@꒰🔮꒱ ୨୧ Información", "")
          ?.trim();
      const attachment = message.attachments.first();
      if (
        !content?.length &&
        !["png", "gif", "jpg", "jpeg"].includes(
          attachment?.name?.split(".").pop()
        )
      )
        return;
      const guildDB =
        (await this.client.db.guilds.findById(message.guild.id)) ||
        new this.client.db.guilds({ _id: message.guild.id });

      const embed = new MessageEmbed().setColor("#2c2f33").setFooter(`FONTE: ${message.author.username}`, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=4096`);

      if (attachment) {
        embed.setImage(attachment.url);
      }

      if (content) {
        const [translation] = await translate.translate(content, "pt");
        embed.setDescription(
          `> **Original:**\n\`\`\`${message.content}\`\`\` \n\n> **Traduzido:**\n\`\`\`${translation}\`\`\``
        );
      }

      switch (message.channel.id) {
        case guildDB.canais?.ofertas_original:
          message.guild.channels.cache
            .get(guildDB.canais?.ofertas_traduzido)
            ?.send({
              embeds: [embed],
              content: `${
                message.guild.roles.cache.get(
                  guildDB.cargos.ofertas
                ) || ""
              }`,
            });
          break;
        case guildDB.canais?.informacoes_original:
          message.guild.channels.cache
            .get(guildDB.canais?.informacoes_traduzido)
            ?.send({
              embeds: [embed],
              content: `${
                message.guild.roles.cache.get(
                  guildDB.cargos.informacoes
                ) || ""
              }`,
            });
          break;
        case guildDB.canais?.missoes_original:
          message.guild.channels.cache
            .get(guildDB.canais?.missoes_traduzido)
            ?.send({
              embeds: [embed],
              content: `${
                message.guild.roles.cache.get(
                  guildDB.cargos.missoes
                ) || ""
              }`,
            });
          break;
      }
    }
  };
};

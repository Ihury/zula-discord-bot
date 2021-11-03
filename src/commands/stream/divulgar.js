const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "divulgar",
      description: "Divulgue seu vídeo/stream",
      options: [
        {
          name: "url",
          description: "URL do vídeo/stream",
          required: true,
          type: "STRING",
        },
        {
          name: "tipo",
          description: "Tipo do link (live/vídeo)",
          required: true,
          type: "STRING",
          choices: [
            {
              name: "live",
              value: "live",
            },
            {
              name: "vídeo",
              value: "video",
            },
          ],
        },
      ],
      requireDatabase: true,
      cooldown: 60000 * 60 * 12
    });
  }

  run = (interaction) => {
    const canalDivulgacoes = interaction.guild.channels.cache.get(
      interaction.guild.db.canais.divulgacoes
    );
    if (!canalDivulgacoes)
      return interaction.errorReply(
        interaction,
        "Não foi possível encontrar o canal de divulgações!"
      );
    const type = interaction.options.getString("tipo");
    const url = interaction.options.getString("url");
    if (!url.startsWith("http://") && !url.startsWith("https://"))
      return this.client.errorReply(
        interaction,
        "Informe um link de vídeo ou live válido!"
      );

    // regex que verifica se o link é de uma live da twitch
    const regexTwitch =
      /^(?:https?:\/\/)?(?:www\.)?(?:twitch\.tv\/)([a-zA-Z0-9_]+)$/;
    // regex que verifica se o link é de um vídeo ou uma live do youtube
    const regexYoutube =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    // regex que verifica se o link é de uma live da trovo
    const regexTrovo =
      /^(?:https?:\/\/)?(?:www\.)?(?:trovo\.live\/)?([a-zA-Z0-9_]+)$/;

    const embed = new MessageEmbed()
      .setTitle("Divulgação")
      .setDescription(
        `${interaction.user.toString()} está divulgando ${
          type === "live" ? "uma" : "um"
        } ${type}!${type === "live" ? " Não perca!" : ""}`
      )
      .setFooter(
        `Divulgador: ${interaction.user.username}`,
        interaction.user.displayAvatarURL({ format: "png", dynamic: true })
      );

    const row = new MessageActionRow().addComponents(
      new MessageButton().setStyle("LINK").setLabel("Assistir!").setURL(url)
    );

    if (url.match(regexTwitch)) {
      embed.setColor("#8F00FF");
      embed.setThumbnail(
        this.client.emojis.cache.find((e) => e.name === "twitch")?.url
      );
    } else if (url.match(regexTrovo)) {
      embed.setColor("#00FF87");
      embed.setThumbnail(
        this.client.emojis.cache.find((e) => e.name === "trovo")?.url
      );
    } else if (url.match(regexYoutube)) {
      embed.setColor("#FF0000");
      embed.setThumbnail(
        this.client.emojis.cache.find((e) => e.name === "youtube")?.url
      );
    } else
      return this.client.errorReply(
        interaction,
        "Informe um link de vídeo ou live válido!"
      );

    canalDivulgacoes.send({
      embeds: [embed],
      components: [row],
      content: `${
        interaction.guild.roles.cache.get(
          interaction.guild.db.cargos.divulgacoes
        ) || ""
      }`,
    });
    this.client.successReply(interaction, "Divulgação enviada com sucesso!");
  };
};

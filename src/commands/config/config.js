const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "config",
      description: "Configura os dados do bot.",
      options: [
        {
          name: "canal",
          description: "Configura os canais do bot.",
          type: "SUB_COMMAND_GROUP",
          options: [
            "divulgacoes",
            "comandos",
            "ofertas_original",
            "ofertas_traduzido",
            "informacoes_original",
            "informacoes_traduzido",
            "missoes_original",
            "missoes_traduzidas",
            "boas_vindas",
          ].map((o) => ({
            name: o,
            type: "SUB_COMMAND",
            description: `Configura o canal ${o} do bot.`,
            options: [
              {
                type: "CHANNEL",
                name: "canal",
                description: "Canal a ser setado.",
                required: true,
              },
            ],
          })),
        },
        {
          name: "cargo",
          description: "Configura os cargos do bot.",
          type: "SUB_COMMAND_GROUP",
          options: [
            "divulgacoes",
            "ofertas",
            "informacoes",
            "missoes",
            "membro",
          ].map((o) => ({
            name: o,
            type: "SUB_COMMAND",
            description: `Configura o cargo ${o} do bot.`,
            options: [
              {
                type: "ROLE",
                name: "cargo",
                description: "Cargo a ser setado.",
                required: true,
              },
            ],
          })),
        },
        {
          name: "auto_role",
          description: "Configura os cargos do painel de auto role.",
          type: "SUB_COMMAND_GROUP",
          options: ["divulgacoes", "ofertas", "informacoes", "missoes"].map(
            (o) => ({
              name: o,
              type: "SUB_COMMAND",
              description: `Configura o cargo ${o} do auto role.`,
              options: [
                {
                  type: "ROLE",
                  name: "cargo",
                  description: "Cargo a ser setado.",
                  required: true,
                },
                {
                  type: "STRING",
                  name: "descricao",
                  required: true,
                  description: "Descrição do cargo.",
                },
                {
                  type: "STRING",
                  name: "emoji",
                  required: true,
                  description: "Emoji do cargo.",
                },
              ],
            })
          ),
        },
      ],
      permissions: [
        {
          type: "ROLE",
          id: "903351669344043129",
          permission: true,
        },
      ],
      defaultPermission: false,
      requireDatabase: true,
    });
  }

  run = (interaction) => {
    const subCommandGroup = interaction.options.getSubcommandGroup();
    const subCommand = interaction.options.getSubcommand();

    if (subCommandGroup === "canal") {
      const channel = interaction.options.getChannel("canal");
      if (channel.type !== "GUILD_TEXT")
        return this.client.errorReply(
          interaction,
          "Informe um canal de texto!"
        );

      interaction.guild.db.canais[subCommand] = channel.id;
      interaction.guild.db.save((err, res) => {
        if (err)
          return this.client.errorReply(
            interaction,
            `Erro ao salvar o banco de dados!\n\n\`${err.message}\``
          );
        this.client.successReply(
          interaction,
          `Canal ${subCommand} configurado com sucesso!`
        );
      });
    } else if (subCommandGroup === "cargo") {
      const channel = interaction.options.getRole("cargo");

      interaction.guild.db.cargos[subCommand] = channel.id;
      interaction.guild.db.save((err, res) => {
        if (err)
          return this.client.errorReply(
            interaction,
            `Erro ao salvar o banco de dados!\n\n\`${err.message}\``
          );
        this.client.successReply(
          interaction,
          `Cargo ${subCommand} configurado com sucesso!`
        );
      });
    } else if (subCommandGroup === "auto_role") {
      const role = interaction.options.getRole("cargo");
      const descricao = interaction.options.getString("descricao");
      const emojiResolvable = interaction.options.getString("emoji");
      const emoji = interaction.guild.emojis.cache.find(
        (e) =>
          e.name === emojiResolvable ||
          e.id === emojiResolvable ||
          e.toString() === emojiResolvable
      );

      if (!emoji) return this.client.errorReply(interaction, `Emoji inválido!`);

      if (!interaction.guild.db.auto_role)
        interaction.guild.db.auto_role = {};
      interaction.guild.db.auto_role[subCommand] = {
        emoji: emoji.id,
        role: role.id,
        description: descricao,
      };

      interaction.guild.db.save((err, res) => {
        if (err)
          return this.client.errorReply(
            interaction,
            `Erro ao salvar o banco de dados!\n\n\`${err.message}\``
          );
        this.client.successReply(
          interaction,
          `Auto role ${subCommand} configurado com sucesso!`
        );
      });
    }
  };
};

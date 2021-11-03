const Command = require("../../structures/Command");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");
module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "set_autorole",
      description: "Seta o painel de cargos automáticos do bot",
      options: [
        {
          type: "CHANNEL",
          required: true,
          description: "Canal de texto para enviar a mensagem",
          name: "canal",
        },
      ],
      requireDatabase: true,
      permissions: [
        {
          type: "ROLE",
          id: "903351669344043129",
          permission: true,
        },
      ],
      defaultPermission: false,
    });
  }

  run = (interaction) => {
    const channel = interaction.options.getChannel("canal");
    if (channel.type !== "GUILD_TEXT")
      return this.client.errorReply(
        interaction,
        "Este canal não é um canal de texto!"
      );

    if ((interaction.guild.db?.auto_role || 0) < 4)
      return this.client.errorReply(
        interaction,
        "Não há cargos automáticos o suficiente neste servidor!"
      );
    const roles = Object.values(interaction.guild.db.auto_role);

    const selectMenu = new MessageSelectMenu()
      .setPlaceholder("Selecione os cargos que deseja ter")
      .setMinValues(0)
      .setMaxValues(roles.length)
      .setCustomId("auto_role");

    for (const v of roles) {
      const role = interaction.guild.roles.cache.get(v.role);
      if (role)
        selectMenu.addOptions({
          label: role.name,
          value: role.id,
          description: v.description,
          emoji: v.emoji,
        });
    }

    if (!selectMenu.options[0])
      return this.client.errorReply(
        interaction,
        "Nenhum cargo foi encontrado aqui!"
      );

    const row = new MessageActionRow().addComponents(selectMenu);

    const embed = new MessageEmbed()
        .setTitle("Cargos automáticos")
        .setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true}))
        .setDescription(`\`\`\`diff\n+ SELECIONE ABAIXO OS CARGOS QUE DESEJA\`\`\``)
        .setFooter('Caso queira remover um cargo, basta retirar a seleção deste.\nApós selecionar os cargos que deseja, basta clicar fora da caixa para recebê-los.', this.client.user.displayAvatarURL())
        .setColor('GREEN')

    channel
      .send({ embeds: [embed], components: [row], content: '@everyone' })
      .then(async (msg) => {
        this.client.successReply(interaction, "Mensagem enviada com sucesso!");
      })
      .catch((err) => {
        this.client.errorReply(
          interaction,
          "Não foi possível enviar a mensagem!"
        );
        console.log(err)
      });
  };
};

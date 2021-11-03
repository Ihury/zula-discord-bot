const { Schema, model } = require('mongoose')

const autoRoleModel = { emoji: String, role: String, description: String }

const guildSchema = new Schema({
    _id: String,
    canais: {
        divulgacoes: String,
        comandos: String, 
        ofertas_original: String,
        ofertas_traduzido: String,
        informacoes_original: String,
        informacoes_traduzido: String,
        missoes_original: String,
        missoes_traduzidas: String,
        boas_vindas: String,
    },
    cargos: {
      divulgacoes: String,
      ofertas: String,
      informacoes: String,
      missoes: String,
      membro: String
    },
    auto_role: {
      divulgacoes: autoRoleModel,
      ofertas: autoRoleModel,
      informacoes: autoRoleModel,
      missoes: autoRoleModel,
    }
})

module.exports = model('guilds', guildSchema)
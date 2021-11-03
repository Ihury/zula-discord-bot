const mongoose = require("mongoose");
const models = require('./models')

module.exports = class {
  constructor() {
  }

  async connect() {
    const connection = await mongoose.connect(process.env.MONGO_URL);

    console.log("🍃 Database conectada com sucesso!");

    this.connection = connection
  }

  async init() {
    const connection = await this.connect();
    Object.assign(this, models)
  }

  close() {
    this.connection.close(function () {
      console.log("🍃 Banco de dados desconectado!");
    });
  }
};

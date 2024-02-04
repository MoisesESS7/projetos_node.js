const Sequelize = require("sequelize");
const connection = require("./database");

const Resposta = connection.define("respostas", {
    corpo: {
        type: Sequelize.TEXT,
        alownNull: false
    },
    perguntaId: {
        type: Sequelize.INTEGER,
        alownNull: false
    }
});

Resposta.sync({force: false}).then(() => {});

module.exports = Resposta;
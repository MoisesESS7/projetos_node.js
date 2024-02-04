const Sequelize = require('sequelize');
const connection = require('./database');

const Pergunta = connection.define('perguntas', {
    titulo: {
        type: Sequelize.STRING,
        alownNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        alownNull: false
    }
});

Pergunta.sync({force: false}).then(() => {});

module.exports = Pergunta;
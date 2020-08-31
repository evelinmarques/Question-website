const Sequelize = require('sequelize');

// integração com o Banco de Dados. Para isso em const connection preencha com o seu usuário e senha.
const connection = new Sequelize('question', 'root', 'suasenhaaqui',{
host: 'localhost', // complete com o nome do host, no meu caso é localhost
dialect: 'mysql'
});

module.exports = connection;
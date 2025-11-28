
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite' 
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('pegou ai a conexão, chefe.');
    
    
    await sequelize.sync();
    console.log('Todos os modelos foram sincronizados.');
  } catch (error) {
    console.error('pegou não a conexão, guerreiro:', error);
  }
}

module.exports = {
  sequelize,
  connectDB
};
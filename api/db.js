const Sequelize = require('sequelize');
console.log('database name');
console.log('database name', process.env['DATABASE_NAME']);
const sequelize = new Sequelize(process.env['DATABASE_NAME'], process.env['DATABASE_USER'], process.env['DATABASE_PASSWORD'], {
  host: process.env['DATABASE_HOST'],
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

const User = sequelize.define('users', {
    id: {type: Sequelize.UUIDV4, primaryKey: true},
    optional_id: Sequelize.STRING
});

module.exports = User;

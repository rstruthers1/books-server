module.exports = require('knex')({
  client: 'mysql2',
  connection: {
    host : '127.0.0.1',
    port : 3306,
    user : 'bookappuser',
    password : 'password1',
    database : 'books'
  }
});

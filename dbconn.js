var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'db4free.net',
  user            : 'yethuaung',
  password        : 'Zikimi95',
  database        : 'testing_node'
});

module.exports = pool;

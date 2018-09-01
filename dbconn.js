var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'db4free.net',
  user            : 'yethuaung',
  password        : 'Zikimi95',
  database        : 'db_blank'
});

module.exports = pool;

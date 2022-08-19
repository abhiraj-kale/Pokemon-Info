var mysql = require("mysql");

var con = mysql.createConnection({
    connectionLimit : 100,
    host     : 'mysql-86015-0.cloudclusters.net',
    port     :  18676,
    user     : 'admin',
    password : 'jgbk2xR2',
    database : 'pokemon',
});

exports.con = con;
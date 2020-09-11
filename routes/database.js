var mysql = require('mysql');

var con = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '1',
	database : 'wedrive',	
	multipleStatements : true
});

con.connect(function(err) {
	if (err) {
		console.error("error connection : " + err.stack);
		throw err;
	} 
});

module.exports = con;

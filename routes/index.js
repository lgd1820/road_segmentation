var express = require('express');
var router = express.Router();
var mysql = require('./database.js');
var redis = require('redis');
var client = redis.createClient();

/* GET home page. */
router.get('/', function(req, res) {
//	mysql.query("show databases", function(err, result){
//		if(err) throw err;
//		console.log(result);
//	});
	list = {};
	client.set('name', 'test');
	for(var a = 0; a < 30; a++){
		var q = ''+a;
		list[''+a] = a;
		//client.lpush('first', a);
	}
	//client.hmset('test',list);

	client.llen('first', function(err, reply){
		console.log(reply);
		if(reply > 20){
			client.lpop('first', function(err, reply){
				console.log(reply);
			});
		}
	});
/*	
	client.get('first', function(err, reply){
		if(err) console.log(err);
		console.log(reply);
	});
*/	
	res.render('index', { title: 'Express' });
});

module.exports = router;

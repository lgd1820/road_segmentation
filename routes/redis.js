var express = require('express');
var router = express.Router();
var mysql = require('./database.js');
var redis = require('redis');
var client = redis.createClient();
var segment = require('../public/js/segment.js')

/* GET home page. */
router.get('/', function(req, res) {
	client.flushdb( function(err, reply){
		console.log(reply);
	});
	mysql.query("select * from segment", function(err, result){
		if(err) throw err;
//		console.log(typeof(result));
		for(var n = 0; n < result.length; n++){
			var info = { "linkPoints":result[n]['linkPoints'], "totalDistance":result[n]['totalDistance'], 
			"tollLink":result[n]['tollLink'], "roadName":result[n]['roadName'], "idxName":result[n]['idxName'],
			"roadCategory":result[n]['roadCategory'], "speed":result[n]['speed'], "linkFacil":result[n]['linkFacil']};
			client.hmset('seg:' + result[n]['linkId'], info);
			var cell = result[n]['cell'].split('-');
			cell.shift();
//			console.log(cell);
			for(var a = 0; a < cell.length; a++){
				client.lpush('cell:' + cell[a], result[n]['linkId']);
			}
		}		
		client.hgetall('seg:6318', function(err, resu){
			console.log(resu);
		});
	});
	res.send('setting\n');
});

//	32.950424
//	124.773835
//	

router.post('/', function(req, res){
	client.exists('id:' + req.body.id, function(err, ex_rep){
//		console.log(ex_rep);
		segment.IdExist(client, req.body.id, ex_rep, req);
		
	});	
	res.send('index');	
});
module.exports = router;

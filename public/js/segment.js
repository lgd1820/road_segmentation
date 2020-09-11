//
// 작성일 : 2020-09-11
// 작성자 : 이권동
// 코드 개요 : redis를 이용한 위치색인을 하는 모듈
//
var regression = require('js-regression');
var la = (38.763189 - 32.950424)/650;
var lo = (131.563393 - 124.773835)/650;

// 함수 개요 :
//    운전자가 존재하는지 확인하는 모듈
// 매개변수 :
//    client = redis client
//    id = 운전자 ID
//    ex_rep = 운전자 고유 ID(hash 값)
//    req = request 객체
module.exports.IdExist = function(client, id, ex_rep, req){
	if( ex_rep == 0 ){
		var hash = 0;
		for ( var i = 0; i < id.length; i++){
			var char = id.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash;
		}   
		console.log('id:' + id + ' hash:' + hash);
		client.hset('id:' + id, 'h_id', hash);
		client.lpush('h_id:' + hget_rep.h_id + '_x', req.body.x);
		client.lpush('h_id:' + hget_rep.h_id + '_y', req.body.y);
		FindSegment(client, req, id);			
	} else {
		client.hgetall('id:' + id, function(err, hget_rep){
			client.llen('h_id:' + hget_rep.h_id + '_x', function(err, llen_rep){
//				console.log(hget_rep.h_id + ':'+ llen_rep);
				if ( llen_rep > 19 ){
					client.rpop('h_id:' + hget_rep.h_id+'_x');
					client.rpop('h_id:' + hget_rep.h_id+'_y');
				}   
				client.lpush('h_id:' + hget_rep.h_id + '_x', req.body.x);
				client.lpush('h_id:' + hget_rep.h_id + '_y', req.body.y);
			}); 
			FindSegment(client, req, id);
			//SegChange(client, req, hget_rep, id);
		});
	}
};

// 함수 개요 :
//    세그먼트가 변경되었는지 확인하는 
// 매개변수 :
//    client = redis client
//    req = request 객체
//    hget_rep = 현재 id의 세그먼트 위치
//    id = 운전자 ID
function SegChange(client, req, hget_rep, id){
	var x = req.body.x; 
	var y = req.body.y; 
	client.hget('seg:' + hget_rep.segment, 'linkPoints', function(err, seg_rep){
		var link_points = JSON.parse((seg_rep).replace(/location/gi,"\"location\"").
				replace(/latitude/gi, "\"latitude\"").replace(/longitude/gi, "\"longitude\""));
		var seg_flag = 0;
		for(var link in link_points){
			g_list_x.push(link_points[link]['location']['latitude']);
			g_list_y.push(link_points[link]['location']['longitude'])
		}
			
		var s_lat = Math.min.apply(null, g_list_x);
		var s_lon = Math.min.apply(null, g_list_y);
		var e_lat = Math.max.apply(null, g_list_x);
		var e_lon = Math.max.apply(null, g_list_y);
		if( ((x >= s_lat) && (y >= s_lon))){
			if((x <= e_lat) && (y <= e_lon)){
				seg_flag = 1;
			}
		} 
	
		if(seg_flag = 0){
			FindSegment(client, req, id);
		}
	});
};

// 함수 개요 :
//    현재 위치 세그먼트를 redis에서 수정하는 모듈
// 매개변수 :
//    client = redis client
//    req = request 객체
//    id = 운전자 ID
function FindSegment(client, req, id){
	var x = req.body.x; 
	var y = req.body.y; 
	var gx = Math.ceil((x - 32.950424)/la); 
	var gy = Math.ceil((y - 124.773835)/lo); 
	var cell = gx + gy * 650;
	client.lrange('cell:' + cell, 0, -1, function(err, lran_rep){
		var in_seg = [];
		var cnt = 0;
		for(var l in lran_rep){
			var link_P;
			var g_list_x = [];
			var g_list_y = [];
			client.hget('seg:' + lran_rep[l], 'linkPoints', function(err, seg_rep){
				var link_points = JSON.parse((seg_rep).replace(/location/gi,"\"location\"").
					replace(/latitude/gi, "\"latitude\"").replace(/longitude/gi, "\"longitude\""));
				for(var link in link_points){
					g_list_x.push(link_points[link]['location']['latitude']);
					g_list_y.push(link_points[link]['location']['longitude'])
				}
			
				var s_lat = Math.min.apply(null, g_list_x);
				var s_lon = Math.min.apply(null, g_list_y);
				var e_lat = Math.max.apply(null, g_list_x);
				var e_lon = Math.max.apply(null, g_list_y);
				if( ((x >= s_lat) && (y >= s_lon))){
					if((x <= e_lat) && (y <= e_lon)){
					//console.log('==');
					//console.log(s_lat + ' / ' + x + ' / ' + e_lat);
					//console.log(s_lon + ' / ' + y + ' / ' + e_lon);
					//						console.log(lran_rep[l]);						}
					in_seg.push(lran_rep[l]);
					//console.log('ok');
					}
				}
			});
		}

//		console.log(cnt);
//		console.log(lran_rep.length);
		if( in_seg.length == 0 ){
			// request
		} else {
			//
			client.hset('id:' + id, 'segment', in_seg[0]);
			console.log(in_seg); 
		}	
		
	});
};


/**
 * adv model
 */
var settings = require('../settings');
var log = require('log4js').getLogger("app");

function Adv(){
}

module.exports = Adv;

Adv.queryAdverList = function queryAdverList(req,data,callback){
	var sql="select id,title,concat('"+settings.IMAGE_HOST+"',imgPath)imgPath,appId from IndexBannar where status=1 and systemType = ? and appType = ? order by orderNo";
	req.getConnection(function(err, connection) {
		connection.query(sql,[data['system'],data['type']],function(err,rows){
			if(err) log.error("查询出错: ",err.stack);
			callback(rows);
		});
	});
}

// Adv.queryAdverList = function queryAdverList(req,data,callback){
// 	var sql="select id,title,concat('"+settings.IMAGE_HOST+"',imgPath)imgPath,appId from IndexBannar where status=1 and systemType = ? order by orderNo";
// 	req.getConnection(function(err, connection) {
// 		connection.query(sql,[data['system']],function(err,rows){
// 			if(err) log.error("查询出错: ",err.stack);
// 			callback(rows);
// 		});
// 	});
// }
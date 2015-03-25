/**
 * appkey model
 */
var storeUtil = require('../util/storeUtil');
var log = require('log4js').getLogger("app");

function Appkey(deviceId){
	this.deviceId = deviceId;
}

module.exports = Appkey;

Appkey.getRowCount = function getRowCount(req,deviceId,system,callback){
	req.getConnection(function(err, connection) {
		connection.query('select count(1) as count from AppKeys where deviceId = ? and systemType = ?',[deviceId,system],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows[0].count);
		});
	});
}

Appkey.getAppkey = function getAppkey(req,deviceId,system,callback){
	req.getConnection(function(err, connection) {
		connection.query('select appKey from AppKeys where deviceId = ? and systemType = ?',[deviceId,system],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			if(rows.length==0) callback(null);
			else callback(rows[0].appKey);
		});
	});
}

Appkey.insertkey = function insertkey(req,deviceId,system,callback){
	req.getConnection(function(err, connection) {
		var data = {
			deviceId	:deviceId,
			appKey		:storeUtil.createRandomNum(11),
			createTime:new Date(),
			systemType:system
		};

		connection.query('insert into AppKeys set ? ',data,function(err,rows){
			if(err){
				log.error("插入出错: ", err.stack);
				callback(null);
			} 
			callback(data.appKey);
		});
	});
}

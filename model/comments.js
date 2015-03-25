/**
 * feedback model
 */
var util = require('util');
var fs = require('fs');
var log = require('log4js').getLogger("app");

 function Comment(accountId,content,mac,starLevel,appId){
 	this.accountId = accountId;
 	this.content = content;
 	this.mac = mac;
 	this.starLevel = starLevel;
 	this.appId = appId;
 }

 module.exports = Comment;

 Comment.prototype.isGradeComment = function isGradeComment(req,callback){
 	var tableName = 'AppCommentHistory_' + this.appId%10;
 	var sql="select count(0) c from "+tableName+" where app_id=? and (account_id=? or mac=?)";
 	var appId = this.appId;
 	var accountId = this.accountId;
 	var mac = this.mac;
 	req.getConnection(function(err, connection) {
		connection.query(sql,[appId,accountId,mac],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows[0].c>0?true:false);
		});
	}); 
 }

 Comment.prototype.isGradeStarLevel = function isGradeStarLevel(req,callback){
 	var sql="select count(0)c from AppStarLevel where appId=? and (accountId=? or mac=?)";
 	var appId = this.appId;
 	var accountId = this.accountId;
 	var mac = this.mac;
 	req.getConnection(function(err, connection) {
		connection.query(sql,[appId,accountId,mac],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows[0].c>0?true:false);
		});
	}); 
 }

 Comment.prototype.addCommentHistory = function addCommentHistory(req,callback){
 	var comment = { 
 	 app_id : this.appId,
 	 account_id : this.accountId,
	 content: this.content, 
	 mac: this.mac,
	 starLevel: this.starLevel,
	 createTime: new Date()
	};
	var tableName = 'AppCommentHistory_' + this.appId%10;
	var sql ="insert into "+tableName+" set ? ";
	req.getConnection(function(err, connection) {
		connection.query(sql,comment,function(err,rows){
			if(err) log.error("插入出错: ", err.stack);
			callback(rows.insertId);
		});
	}); 
 }

 Comment.prototype.cppyToComment = function cppyToComment(req){
 	var cont = this.content.trim();
 	var id = this.id;
 	var appId = this.appId;
 	if(cont){
 		fs.readFile('./keyword.txt','utf-8',function(err,data){
 			var bool = false;
 			if(err) throw err;
 			var keys = data.split(",");
 			for(var value in keys){
 				if(cont.indexOf(keys[value])!=-1){
 					bool = true;
 					break;
 				}
 			}
 			if (!bool) {
 				var hisTableName = 'AppCommentHistory_' + appId%10;
 				var tableName = 'AppComment_' + appId%10;
 				var sql="insert into "+tableName+"(app_id,content,mac,status,starLevel,account_id,createTime,writeTime)" +
				   "select app_id,content,mac,1,starLevel,account_id,createTime,now() from "+hisTableName+" where id=?";
 				req.getConnection(function(err, connection) {
 					connection.query(sql,[id],function(err,rows){
 						if(err) log.error("插入出错: ", err.stack);
 					});
 				}); 
 			};
 		});
 	}
 }

 Comment.prototype.addStarLevel = function addStarLevel(req,callback){
 	var comment = { 
 	 appId : this.appId,
 	 accountId : this.accountId,
	 mac: this.mac,
	 starLevel: this.starLevel,
	 createTime: new Date()
	};
	var sql ="insert into AppStarLevel set ? ";
	req.getConnection(function(err, connection) {
		connection.query(sql,comment,function(err,rows){
			if(err) log.error("插入出错: ", err.stack);
			callback();
		});
	}); 
 }

 Comment.queryCommentList = function queryCommentList(req,data,callback){
 	var pageSize = Number(data['pageSize']);
	var pageStart = (Number(data['pageNum'])-1)*pageSize;
	var appId = data['appId'];
	var tableName = 'AppComment_'+appId%10;
	var sql="select account_id,content,DATE_FORMAT(createTime,'%Y-%m-%d %T')createTime, starLevel from "+
		tableName+" where app_id=? and status=1 order by createTime desc limit ?,?";
	req.getConnection(function(err, connection) {
		connection.query(sql,[appId,pageStart,pageSize],function(err,rows){
			if(err) log.error("插入出错: ", err.stack);
			callback(rows);
		});
	}); 
 }

/**
 * feedback model
 */
var log = require('log4js').getLogger("app");

 function Feedback(content,number,system){
 	this.content = content;
 	this.number = Number(number);
 	this.date = new Date();
 	this.system = system;
 }

 module.exports = Feedback;

 Feedback.prototype.addFeedback = function addFeedback(req,callback){
 	var feedback = { 
	 content: this.content, 
	 telphone: this.number, 
	 writeDate: this.date,
	 systemType: this.system
	};
	var sql ="insert into FeedBack set ? "
	req.getConnection(function(err, connection) {
		connection.query(sql,feedback,function(err,rows){
			if(err) log.error("插入出错: ", err.stack);
			callback(rows.affectedRows);
		});
	}); 
 }
/**
 * app model
 */
var settings = require('../settings');
var log = require('log4js').getLogger("app");

var Segment = require('segment').Segment;


var segment = new Segment();
segment.useDefault();

 function Apps(){
}

module.exports = Apps;

Apps.queryAppList = function queryAppList(req,data,callback){
	var pageSize = Number(data['pageSize']);
	var pageStart = (Number(data['pageNum'])-1)*pageSize;
	var sql="select a.id,a.appName,a.virtualdwTimes,a.packName,a.starLevel,a.size,a.downloadLink,a.imgJosnField," +
				  "ifnull(apo.orderNo,999999)orderNo from " +
				  "AppTypeJoin apt join Apps a on a.id=apt.app_id " +
				  "left join AppOrder apo on apt.app_id=apo.app_id " +
				  "and apt.app_type_id=apo.type_id " +
					"and apo.systemType = "+data['system'];
	sql+= ' where a.status=1 ';
	if(data['type']){
		sql+=' and apt.app_type_id= '+ data['type'];
	}
	sql+=' and a.systemType = '+ data['system'];
	sql+=' order by orderNo,a.updateTime limit ?,?';
	req.getConnection(function(err, connection) {
		connection.query(sql,[pageStart,pageSize],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows);
		});
	});
}

Apps.queryAppType = function queryAppType(req,data,callback){
	var pageSize = Number(data['pageSize']);
	var pageStart = (Number(data['pageNum'])-1)*pageSize;
	var type = data['type'];
	var system = data['system'];
	var sql="select a.id,a.typeName,a.type,a.description ,concat('"+
					settings.IMAGE_HOST+
					"',a.iconPath)iconPath,ifnull(c.count,0) appTotal,a.topicType classifyType " +
					"from AppType a left outer join "+
					"(select count(0) count,aj.app_type_id type from AppTypeJoin aj "+
					"where  exists(select 1 from Apps ap where aj.app_id=ap.id and ap.status=1) "+
					"group by aj.app_type_id) c "+
					"on c.type = a.id "+
				  "where ifnull(c.count,0)>0 and a.type=? and a.systemType = ? " +
				  "order by a.updateTime desc limit ?,?";
	req.getConnection(function(err, connection) {
		connection.query(sql,[type,system,pageStart,pageSize],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows);
		});
	});
}

Apps.queryTopicAndEval = function queryEval(req,data,callback){
	var pageSize = Number(data['pageSize']);
	var pageStart = (Number(data['pageNum'])-1)*pageSize;
	var type = data['type'];
	var system = data['system'];
	var sql="select * from "+ 
			"(select id,name typeName,1 type,description ,concat('http://androiddownload.zqgame.com',iconPath)iconPath "+
			",1 appTotal,appId,starLevel,1 topicType,updateTime from Evaluate where systemType = ? "+
			" UNION "+
			"select a.id,a.typeName,a.type,a.description ,concat('http://androiddownload.zqgame.com',a.iconPath)iconPath "+
			",ifnull(c.count,0) appTotal,0 appId,0 starLevel,a.topicType ,updateTime "+
			"from AppType a left outer join "+
			"(select count(0) count,aj.app_type_id type from AppTypeJoin aj "+
			"where  exists(select 1 from Apps ap where aj.app_id=ap.id and ap.status=1) "+
			"group by aj.app_type_id) c "+
			"on c.type = a.id "+
			"where ifnull(c.count,0)>0 and a.type=? and a.systemType = ?)t "+
			"order by updateTime DESC "+
			"limit ?,?";
	req.getConnection(function(err, connection) {
		connection.query(sql,[system,type,system,pageStart,pageSize],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows);
		});
	});
}

Apps.queryArticleContent = function queryArticleContent(req,id,callback){
	var sql = "select articleContent from Evaluate where id = ?";
	req.getConnection(function(err, connection) {
		connection.query(sql,[id],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows[0].articleContent);
		});
	});
}

Apps.loadApp = function loadApp(req,data,callback){
	var sql="select virtualdwTimes,packName,size,appName,downloadLink,description,starLevel,version,imgJosnField,language " +
				   "from Apps where id=? and systemType=? limit 1";
	req.getConnection(function(err, connection) {
		connection.query(sql,[data['appId'],data['system']],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows[0]);
		});
	});
}

Apps.queryTypeByApp = function queryTypeByApp(req,data,callback){
	var sql="select t.id,t.typeName from AppTypeJoin a " +
				   "join AppType t on a.app_type_id=t.id " +
				   "where t.type<>2 and a.app_id=? and t.systemType=? " +
				   "order by updateTime";
	req.getConnection(function(err, connection) {
		connection.query(sql,[data['appId'],data['system']],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows);
		});
	});
}

Apps.queryTotalRankList = function queryTotalRankList(req,data,callback){
	var sql = '';
	var pageSize = Number(data['pageSize']);
	var pageStart = (Number(data['pageNum'])-1)*pageSize;
	if (data['type']) {
		if(data['system']==0&&data['type']==4) data['type']=2;// 以后delete掉
		sql ="select a.id,a.appName,a.virtualdwTimes,a.packName,a.starLevel,a.size,a.downloadLink,a.imgJosnField  from " +
				 "AppTypeJoin apt join Apps a on a.id=apt.app_id " ;
				  
		sql+=" where a.status=1 and a.systemType=? ";

		sql+=" and apt.app_type_id="+data['type'];
		
		sql+=" order by virtualdwTimes  desc limit ?,?";
	}else{
		sql= "select a.id,a.appName,a.virtualdwTimes,a.packName,a.starLevel,a.size,a.downloadLink,a.imgJosnField  from Apps a " +
				 "where a.status=1 and a.systemType = ? " +
				 "order by virtualdwTimes  desc limit ?,?" ;
	}
	req.getConnection(function(err, connection) {
		connection.query(sql,[data['system'],pageStart,pageSize],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows);
		});
	});
}


Apps.searchAppList = function searchAppList(req,data,callback){
	var pageSize = Number(data['pageSize']);
	var pageStart = (Number(data['pageNum'])-1)*pageSize;
	var appName = data['appName'];
	var sql= "select a.id,a.appName,a.virtualdwTimes,a.packName,a.starLevel,a.size,a.downloadLink,a.imgJosnField  from Apps a " +
				    "where a.status=1 and a.systemType=? " ;
	appNames = segment.doSegment(appName);
	log.info(appNames);
	if(appNames.length>0){
		sql+=" and(";
		for(var value in appNames){
			if(value>0){
				sql+=" or";
			}
			sql+=" a.appName like '%"+appNames[value].w+"%'";
		}
		sql+=") ";
	}
	sql+=" order by virtualdwTimes  desc limit ?,?";
	req.getConnection(function(err, connection) {
		connection.query(sql,[data['system'],pageStart,pageSize],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows);
		});
	});
}


Apps.updateStar = function updateStar(req,appId,callback){
	var sql="update Apps set starLevel=(select format(avg(starLevel),1)c from AppStarLevel where appId=?) where id=?";
	req.getConnection(function(err, connection) {
		connection.query(sql,[appId,appId],function(err,rows){
			if(err) log.error("更新出错: ", err.stack);
			callback();
		});
	});
}


Apps.insertDownLoadHistory = function insertDownLoadHistory(req,appId,callback){
	var downloadHistory = {
		appId : appId,
		downloadDate: new Date().Format("yyyy-MM-dd ")
	}
	var tableName = 'AppDownLoadHistory_'+appId%100;
	var sql="insert into "+tableName+" set ? on duplicate key update downloadCount=downloadCount+1";
	req.getConnection(function(err, connection) {
		connection.query(sql,downloadHistory,function(err,rows){
			if(err) log.error("插入出错: ", err.stack);
			callback();
		});
	});
}


Apps.updateDownLoadCount = function updateDownLoadCount(req,appId){
	var tableName = 'AppDownLoadHistory_'+appId%100;
	var sql="update Apps set realdwTimes= (select sum(downloadCount)c from "+tableName+" where appId=?), virtualdwTimes=virtualdwTimes+1  where id=?";
	req.getConnection(function(err, connection) {
		connection.query(sql,[appId,appId],function(err,rows){
			if(err) log.error("更新出错: ", err.stack);
		});
	});
}


Apps.getLastStoreVersion = function getLastStoreVersion(req,version,system,callback){
	var sql = "select version, filePath url, forceVersion, size, msg from StoreHistory where version>? and systemType = ? order by version desc limit 1";
	req.getConnection(function(err, connection) {
		connection.query(sql,[version,system],function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows[0]);
		});
	});
}


Apps.getLastAppVersion = function getLastAppVersion(req,packNames,versions,callback){
	var sql = '';
	for(var value in packNames){	
			sql+= "select id,size,version,appName,downloadLink,packName,imgJosnField from Apps where packName='"+packNames[value]+"' and version>'"+versions[value]+"' limit 1;";
	}
	req.getConnection(function(err, connection) {
		connection.query(sql,function(err,rows){
			if(err) log.error("查询出错: ", err.stack);
			callback(rows);
		});
	});
}


Apps.insertDataReport = function insertDataReport(req,data,callback){
	var type = data['type'];
	var mac = data['mac'];
	var ip = data['ip'];
	var channelid = data['channelid'];
	var system = data['system'];
	var action = {
		mac:mac,
		ip:ip,
		channelid:channelid,
		systemType:system,
		actionTime:new Date()
	}
	var ipSql = "select IF(a.region='',a.country,a.region) country from ip_area_dictionary i left join area a on i.area_id = a.id where INET_ATON(?) BETWEEN i.from_number and i.to_number limit 1";
	req.getConnection(function(err, connection) {
		connection.query(ipSql,ip,function(err,rows){
			if(err) log.error('查询地区出错: ip：'+ip+'    ',err.stack);
			action['area'] = rows[0].country;


			switch (type){
				case '1':
					var sql = "insert into ActiveAction set ?";
					connection.query(sql,action,function(err,rows){
						if(err) log.error('插入ActiveAction出错:',err.stack);
						callback(rows.affectedRows>0?true:false);
					});
					break;
				case '2':
					var sql = "insert into RunAction set ?";
					connection.query(sql,action,function(err,rows){
						if(err) log.error('插入RunAction出错:',err.stack);
						callback(rows.affectedRows>0?true:false);
					});
					break;
				case '3':
					if(!data['appid']){
						callback(false);
					}else{
						action['appid'] = data['appid'];
						var sql = "insert into OpenDetailAction set ?";
						connection.query(sql,action,function(err,rows){
							if(err) log.error('插入OpenDetailAction出错:',err.stack);
							callback(rows.affectedRows>0?true:false);
						});
					}
					break;
				case '4':
				if(!data['appid']){
						callback(false);
					}else{
						action['appid'] = data['appid'];
						var sql = "insert into InstallAction set ?";
						connection.query(sql,action,function(err,rows){
							if(err) log.error('插入InstallAction出错:',err.stack);
							callback(rows.affectedRows>0?true:false);
						});
					}
					break;
				case '5':
					if(!data['account']){
						callback(false);
					}else{
						action['account'] = data['account'];
						var sql = "insert into LoginAction set ?";
						connection.query(sql,action,function(err,rows){
							if(err) log.error('插入LoginAction出错:',err.stack);
							callback(rows.affectedRows>0?true:false);
						});
					}
					break;
				default:
					callback(false);
					break;
			}
		});
	});	
}

Apps.insertBannerClick = function insertBannerClick(req,data,callback){
	var bannerId = data['bannerid'];
	var system = data['system'];
	var sql = "update IndexBannar set dayCount = dayCount+1,weekCount = weekCount+1,totalCount = totalCount+1 where id=? and systemType=? ";
	req.getConnection(function(err, connection) {
		connection.query(sql,[bannerId,system],function(err,rows){
			if(err) log.error('更新indexBannar出错:',err.stack);
			callback(rows.affectedRows>0?true:false);
		});
	});
}

Apps.updateBroadcastUrl = function updateBroadcastUrl(req,data,callback){
	var url = data['url'];
	var system = data['system'];
	var deviceId = data['deviceId'];
	var sql = "update AppKeys set broadcastUrl = ? where systemType = ? and deviceId = ?"
	req.getConnection(function(err, connection) {
		connection.query(sql,[url,system,deviceId],function(err,rows){
			if(err) log.error('更新appkeys出错:',err.stack);
			callback(rows.affectedRows>0?true:false);
		});
	});
}
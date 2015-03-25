var express = require('express');
var router = express.Router();
var settings = require('../settings');
var storeUtil = require('../util/storeUtil');
var appkey = require('../model/appkey');
var apps = require('../model/apps');
var adv= require('../model/adv');
var Feedback = require('../model/feedback');
var Comment = require('../model/comments');

var urlTemplate = settings.urlTemplate;

/* GET 主页 */
router.get('/', function(req, res) {
  res.render('index', { title: 'androidStore Server', words: 'androidStore Server has working.' });
});

/* GET 文章 */
router.get('/html/article', function(req, res) {
	var id = req.query.id;
	apps.queryArticleContent(req,id,function(content){
		 res.render('html/index', { title: '文章', articleContent: content });
	});
});

/* GET 应用启动*/
router.get('/app-init/'+urlTemplate, function(req, res) {
	valid(req,res,function(appkeyNum){
		appkeyEn=storeUtil.des(appkeyNum);
		res.status(200).send({status:200,data:{appCode:appkeyEn}}).end();
	});
});

/* GET 进入首页- 默认选择 类型为 热门的应用*/
router.get('/app-index/'+urlTemplate,function(req, res){
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		apps.queryAppList(req,params,function(appData){
			for(var value in appData){
				if (params['system']==0)  appData[value]['downloadLink'] = settings.APK_HOST+appData[value]['downloadLink'];
				var imgJosnField  = JSON.parse(appData[value]['imgJosnField']);
				appData[value]['imgJosnField'] = settings.IMAGE_HOST+imgJosnField['smallPicPath'];
			}
			adv.queryAdverList(req,params,function(advData){
				res.status(200).send({status:200,data:{app:{resList:appData},adv:{resList:advData}}}).end();
			});
		});
	});
});

/* GET 分类--专题 列表*/
router.get('/classify/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		if(params['system']==1&&params['type']==1&&req.params.versionCode>='1.1.0.0'){//winphone1.1以上版本 专题+测评
			apps.queryTopicAndEval(req,params,function(datas){			
				for(var value in datas){
					if(datas[value]['topicType']==1){
						var url = req.protocol + '://' + req.get('host')+ '/html/article?id='+datas[value]['id'];
						datas[value]['url'] = url;
					}
				}
				res.status(200).send({status:200,data:{resList:datas}}).end();
			});
		}else{
			apps.queryAppType(req,params,function(appTypeData){
				res.status(200).send({status:200,data:{resList:appTypeData}}).end();
			});
		}
	});
});

/* GET 应用详情*/
router.get('/appinfo/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		apps.loadApp(req,params,function(app){
			if(!app){
				res.status(707).send({status:707}).end();
			}
			if (params['system']==0)  app['downloadLink'] = settings.APK_HOST+app['downloadLink'];
			var imgJosnField  = JSON.parse(app['imgJosnField']);
			app['icon'] = settings.IMAGE_HOST+imgJosnField['smallPicPath'];
			app['infoImg'] = [];
			for(var value in imgJosnField['introPicPaths']){
				app['infoImg'].push(settings.IMAGE_HOST+imgJosnField['introPicPaths'][value]);
			}
			switch(app['language']){
				case 0:app['language'] = '简体中文';break;
				case 1:app['language'] = '繁体中文';break;
				case 2:app['language'] = 'English';break;
			}
			apps.queryTypeByApp(req,params,function(typeList){
				res.status(200).send({status:200,app:app,typeList:typeList}).end();
			})
		})
	});
});

/* GET 根据分类 查询游戏*/
router.get('/sublist/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		apps.queryAppList(req,params,function(appData){
			for(var value in appData){
				if (params['system']==0)  appData[value]['downloadLink'] = settings.APK_HOST+appData[value]['downloadLink'];
				var imgJosnField  = JSON.parse(appData[value]['imgJosnField']);
				appData[value]['imgJosnField'] = settings.IMAGE_HOST+imgJosnField['smallPicPath'];
			}
			res.status(200).send({status:200,resList:appData}).end();
		});
	});
});


/* GET 总排行，游戏榜，应用榜*/
router.get('/rank/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		apps.queryTotalRankList(req,params,function(rankList){
			for(var value in rankList){
				if (params['system']==0)  rankList[value]['downloadLink'] = settings.APK_HOST+rankList[value]['downloadLink'];
				var imgJosnField  = JSON.parse(rankList[value]['imgJosnField']);
				rankList[value]['imgJosnField'] = settings.IMAGE_HOST+imgJosnField['smallPicPath'];
			}
			res.status(200).send({status:200,resList:rankList}).end();
		});
	});
});


/* GET 关键词搜索*/
router.get('/search/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		apps.searchAppList(req,params,function(appList){
			for(var value in appList){
				if (params['system']==0)  appList[value]['downloadLink'] = settings.APK_HOST+appList[value]['downloadLink'];
				var imgJosnField  = JSON.parse(appList[value]['imgJosnField']);
				appList[value]['imgJosnField'] = settings.IMAGE_HOST+imgJosnField['smallPicPath'];
			}
			res.status(200).send({status:200,resList:appList}).end();
		});
	});
});

/* GET 意见反馈*/
router.get('/feedback/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		var feedback = new Feedback(params['content'],params['number'],params['system']);
		feedback.addFeedback(req,function(flag){
			if(flag==1) res.status(200).send({status:200}).end();
			else res.status(200).send({status:500}).end();
		});
	});
});


/* GET 添加评论*/
router.get('/comment-add/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		var comment = new Comment(params['accountId'],params['content'],params['mac'],params['starLevel'],params['appId']);
		comment.isGradeComment(req,function(isGrade){
			if (isGrade) res.status(200).send({status:500}).end();
			else{
				comment.addCommentHistory(req,function(id){
					comment.id = id;
					if(id >0){
						res.status(200).send({status:200}).end();
						comment.cppyToComment(req);
					} else{
						res.status(500).send({status:500}).end();
					}
				});
			}
		})
	});
});

/* GET 添加评分*/
router.get('/starlevel/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		var comment = new Comment(params['accountId'],null,params['mac'],params['starLevel'],params['appId']);
		comment.isGradeStarLevel(req,function(isGrade){
			if (isGrade) res.status(200).send({status:500}).end();
			else{
				comment.addStarLevel(req,function(){
					apps.updateStar(req,params['appId'],function(){
						res.status(200).send({status:200}).end();
					})
				})
			} 
		});
	});
});


/* GET 评论列表*/
router.get('/comment-list/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		Comment.queryCommentList(req,params,function(commentList){
			res.status(200).send({status:200,commentList:commentList}).end();
		})
	});
});


/* GET 下载*/
router.get('/updownload/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		apps.insertDownLoadHistory(req,params['appId'],function(){
			apps.updateDownLoadCount(req,params['appId']);
		});
		res.status(200).send({status:200}).end();
	});
});


/* GET 商店版本更新检测*/
router.get('/storecheck/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		if(storeUtil.isBlank(params['version'])) res.status(200).send({status:707}).end();
		else{
			apps.getLastStoreVersion(req,params['version'],params['system'],function(version){
				if(version==null){
					res.status(200).send({status:200,data:{status:0}}).end();//不用更新
				}else{
					var status = 0;
					version['url'] = settings.APK_HOST+version['url'];
					if(version['forceVersion']>params['version']) status=2;//强制更新
					else status =1;//提示更新
					delete version['forceVersion'];
					version['status'] = status;
					res.status(200).send({status:200,data:version}).end();
				}
			});
		}
	});
});


/* GET 已安装app版本更新检测*/
router.get('/appcheck/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		var packNames = params['packName'].split(',');
		var versions = params['version'].split(',');
		if (packNames.length != versions.length) {
			res.status(200).send({status:707}).end();
		}else{
			apps.getLastAppVersion(req,packNames,versions,function(paths){
				var result=[];
				for(var value in paths){
					if(paths[value].length>0){
							if (params['system']==0)  paths[value][0]['downloadLink'] = settings.APK_HOST+paths[value][0]['downloadLink'];
							var imgJosnField  = JSON.parse(paths[value][0]['imgJosnField']);
							paths[value][0]['imgJosnField'] = settings.IMAGE_HOST+imgJosnField['smallPicPath'];
							result.push(paths[value][0]);
					}
				}
				res.status(200).send({status:200,data:result}).end();
			})
		}
	});
});


/* GET 数据统计*/
router.get('/datareport/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		params['mac'] = req.params.mac;
		params['ip'] =  req._remoteAddress || req.headers['x-forwarded-for'] || 
		req.connection.remoteAddress ||
		( req.socket && (req.socket.remoteAddress || (req.socket.socket && req.socket.socket.remoteAddress)));
		if(!storeUtil.isMacOrIpFilter(params['mac'],params['ip'])){
			apps.insertDataReport(req,params,function(bool){
				if (bool) res.status(200).send({status:200}).end();
				else res.status(707).send({status:707}).end();
			});
		}else{
			res.status(200).send({status:200}).end();
		}
	});
});

/* GET 轮播图点击*/
router.get('/bannerclick/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		apps.insertBannerClick(req,params,function(bool){
			if (bool) res.status(200).send({status:200}).end();
			else res.status(707).send({status:707}).end();
		})
	});
});

/* GET 推送地址上传*/
router.get('/broadcastupload/'+urlTemplate, function(req, res) {
	valid(req,res,function(){
		var params = storeUtil.paramToData(req);
		params['deviceId'] = req.params.deviceId;
		apps.updateBroadcastUrl(req,params,function(bool){
			if (bool) res.status(200).send({status:200}).end();
			else res.status(707).send({status:707}).end();
		})
	});
});






/* 验证*/
function valid(req,res,callback){
	if(settings.istimevalid&&!storeUtil.timeValid(req.params.timestamp)){
  	res.status(408).send({status:408}).end();
  	res.end();
  }else{
  	appkey.getRowCount(req,req.params.deviceId,req.params.system,function(count){
  		if(count>0){
  			appkey.getAppkey(req,req.params.deviceId,req.params.system,function(appkeyNum){
  				if(settings.issignvalid&&!storeUtil.signValid(req,appkeyNum)){
  					res.status(417).send({status:417}).end();
  				} else {
  					callback(appkeyNum);
  				}
  			});
  		}else{
  			appkey.insertkey(req,req.params.deviceId,req.params.system,function(appkeyNum){
  				if(!storeUtil.signValid(req,appkeyNum)){
  					res.status(417).send({status:417}).end();
  				} else {
  					callback(appkeyNum);
  				}
  			})
  		}
  	});
  }
}


module.exports = router;

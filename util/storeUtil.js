/*
 * 字符串辅助
 */
var crypto = require('crypto');  
var settings = require('../settings');
var log = require('log4js').getLogger("app");

/* 验证时间*/
exports.timeValid = function(timestamp){
  if(timestamp.length>=13){
      var curTime = new Date().getTime();
    if(curTime - timestamp <=-60*1000*10 || curTime - timestamp >= 60*1000*20){
      log.error('时间戳错误:reqTime=%d , curTime=%d , curTime-reqTime=%d',timestamp,curTime,curTime-timestamp);
      return false;	
    } else{
      return true;
    }
    log.error('时间戳长度错误:reqTime=%d',timestamp);
  }
  return false;
}


/* 生成固定位数随机数*/
exports.createRandomNum = function(size){
  var arr = new Array();
  var str = '';
  for (var i = 0; i < size; i++) {
    arr[i] = parseInt(10*Math.random());
    str +=arr[i];
  };
  return str;
}

/* 签名验证*/
exports.signValid = function(req,appkey){
  var str ='';
  var path = req.path.split('/')[1];
  var param = '';
  var appkeyCode = '';
  if(path==='app-init'){
    param='0';
    appkeyCode=settings.secretkey;
  } else if (path ==='appcheck'||path ==='search'||path ==='rank'||path ==='sublist'||path ==='broadcastupload'){
    param='0';
    appkeyCode=appkey;
  } else{
    param=getFirstParam(req.params.param);
    appkeyCode=appkey;
  }
  str+=param;
  str+=req.params.system;
  str+=req.params.deviceId;
  str+=req.params.versionCode;
  str+=req.params.mac;
  str+=req.params.ip;
  str+=req.params.adv;
  str+=req.params.timestamp;
  str+=appkeyCode;
  
  var sha = crypto.createHash('sha1');
  sha.update(str);
  var en = sha.digest('hex');
  
  if(req.params.sign===en)return true;
  else{
    log.error('签名错误：拼接字符串=%s 加密字符串=%s 传入字符串=%s',str,en,req.params.sign);
    return false;
  } 
}

/* */
exports.paramToData = function(req){
  var data = {};
  var paramArr=req.params.param.split("&");
  for(var value in paramArr){
    var keyArr=paramArr[value].split("=");
      if(keyArr.length==2){
        data[keyArr[0]] = keyArr[1];
      }
  }
  data['system'] = req.params.system;
  return data;
}

/* 3des 加密*/
exports.des = function(text,key){
   //encrypt  
  var cipher = crypto.createCipheriv('des-ede3', new Buffer(settings.secretkey), new Buffer(0));  
  cipher.setAutoPadding(true);  //default true  
  var ciph = cipher.update(text, 'utf8', 'base64');  
  ciph += cipher.final('base64');  
  return ciph;
}

/* 获取第一个参数*/
function getFirstParam(str){
  var paramArr = str.split('&');
  if (paramArr.length>0) {
    var keyArr = paramArr[0].split('=');
    if (keyArr.length==2) {
      return keyArr[1];
    }
  }
  return '0';
}

exports.isBlank = function(str){   
    try{   
        eval("var "+str+"=0;");   
        return true;   
    }catch(e){   
        return false;   
    }   
} 

/* mac地址或IP是否在过滤列表*/
exports.isMacOrIpFilter = function (mac,ip){
  var b = false;
  if(mac){
    b = settings.filterMac.some(function(mac1){
      return mac1===mac;
    });
    if (b) {log.info('数据统计过滤--->通过mac过滤 mac:'+mac+'   ip:'+ip);return b};
  }
  if(ip){
    b = settings.filterIp.some(function(ip1){
      return ip1===ip;
    });
    if (b) {log.info('数据统计过滤--->通过ip过滤 mac:'+mac+'   ip:'+ip);return b};
  }
  return b;
}

exports.createPreString = function (path,params,system){
  //':param/:system/:deviceId/:versionCode/:mac/:ip/:adv/:timestamp/:sign'
  var param,appkeyCode ;
  var deviceId = system=='0'?'unitTest':'unitTestWP';
  var appkey = system=='0'?'8080':'8081';
  var versionCode = '0';
  var mac = '1:2:3:4';
  var ip = '8.8.8.8';
  var adv = 'unit';
  var timestamp = new Date().getTime();

  if(path==='app-init'){
    param='0';
    appkeyCode=settings.secretkey;
  } else if (path ==='appcheck'||path ==='search'||path ==='rank'||path ==='sublist'||path ==='broadcastupload'){
    param='0';
    appkeyCode=appkey;
  } else{
    param=getFirstParam(params);
    appkeyCode=appkey;
  }
  var str = '';
  str+=param;
  str+=system;
  str+=deviceId;
  str+=versionCode;
  str+=mac;
  str+=ip;
  str+=adv;
  str+=timestamp;
  str+=appkeyCode;

  var sha = crypto.createHash('sha1');
  sha.update(str);
  var sign =  sha.digest('hex');
  var url = params+'/'+system+'/'+deviceId+'/'+versionCode+'/'+mac+'/'+ip+'/'+adv+'/'+timestamp+'/'+sign;
  return url;
}



// 对Date的扩展，将 Date 转化为指定格式的String 
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}

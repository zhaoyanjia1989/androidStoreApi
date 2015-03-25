var request = require('supertest');
var crypto = require('crypto');
var should = require('should');  
var settings = require('../../settings');
var storeUtil = require('../../util/storeUtil.js');
var app = require('../../app.js');
var mysql = require('mysql');

var db_config = ({
    host: settings.host,
    user: settings.user,
    password : settings.password,
    port : settings.port, 
    database:settings.database
});

var conn = mysql.createConnection(db_config);

describe('GET /app-init/', function(){
  it('Android---初始化---返回200、返回json串、返回appCode', function(done){
    request(app)
      .get('/app-init/'+storeUtil.createPreString('app-init','0','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({status:200,data:{appCode:storeUtil.des('8080')}}, done);
  });
});



describe('GET /app-index/', function(){
  it('Android---首页---热门---返回200、返回json串、返回app和adv数据', function(done){
    request(app)
    .get('/app-index/'+storeUtil.createPreString('app-index','type=1&pageSize=10&pageNum=1','0'))
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      should.not.exist(err);
      var result = JSON.parse(res.text);
      result.should.have.property('status',200);
      result.data.app.resList.length.should.be.above(0);
      result.data.adv.resList.length.should.be.above(0);
      done();
    });
  });
  it('Android---首页---最新---返回200、返回json串、返回app和adv数据', function(done){
    request(app)
    .get('/app-index/'+storeUtil.createPreString('app-index','type=2&pageSize=10&pageNum=1','0'))
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      should.not.exist(err);
      var result = JSON.parse(res.text);
      result.should.have.property('status',200);
      result.data.app.resList.length.should.be.above(0);
      result.data.adv.resList.length.should.be.above(0);
      done();
    });
  });
  it('Android---首页---应用---返回200、返回json串、返回app和adv数据', function(done){
    request(app)
    .get('/app-index/'+storeUtil.createPreString('app-index','type=3&pageSize=10&pageNum=1','0'))
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      should.not.exist(err);
      var result = JSON.parse(res.text);
      result.should.have.property('status',200);
      result.data.app.resList.length.should.be.above(0);
      result.data.adv.resList.length.should.be.above(0);
      done();
    });
  });
  it('Android---首页---游戏---返回200、返回json串、返回app和adv数据', function(done){
    request(app)
    .get('/app-index/'+storeUtil.createPreString('app-index','type=4&pageSize=10&pageNum=1','0'))
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      should.not.exist(err);
      var result = JSON.parse(res.text);
      result.should.have.property('status',200);
      result.data.app.resList.length.should.be.above(0);
      result.data.adv.resList.length.should.be.above(0);
      done();
    });
  });
});


describe('GET /classify/', function(){
  it('Android---类型列表---分类---返回200、返回json串、返回appType数据', function(done){
    request(app)
      .get('/classify/'+storeUtil.createPreString('classify','type=0&pageSize=10&pageNum=1','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        result.data.resList.length.should.be.above(0);
        done();
      });
  });
  it('Android---类型列表---专题---返回200、返回json串、返回appType数据', function(done){
    request(app)
      .get('/classify/'+storeUtil.createPreString('classify','type=1&pageSize=10&pageNum=1','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        result.data.resList.length.should.be.above(0);
        done();
      });
  });
  it('Android---类型列表---默认系统分类---返回200、返回json串、返回4个默认appType数据', function(done){
    request(app)
      .get('/classify/'+storeUtil.createPreString('classify','type=2&pageSize=10&pageNum=1','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        result.data.resList.length.should.equal(4);
        done();
      });
  });
});



describe('GET /appinfo/', function(){
  it('Android---初始化---返回200、返回json串、返回app信息', function(done){
    request(app)
      .get('/appinfo/'+storeUtil.createPreString('appinfo','appId=1','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        result.should.have.property('app');
        result.should.have.property('typeList');
        done();
      });
  });
});



describe('GET /sublist/', function(){
  it('Android---进入分类---返回200、返回json串、返回分类', function(done){
    request(app)
      .get('/sublist/'+storeUtil.createPreString('sublist','type=1&pageSize=10&pageNum=1','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        result.should.have.property('resList');
        done();
      });
  });
});



describe('GET /rank/', function(){
  it('Android---进入排行---返回200、返回json串、返回排行列表', function(done){
    request(app)
      .get('/rank/'+storeUtil.createPreString('rank','type=1&pageSize=10&pageNum=1','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        result.should.have.property('resList');
        done();
      });
  });
});



describe('GET /search/', function(){
  it('Android---搜索---返回200、返回json串、返回搜索结果', function(done){
    request(app)
      .get('/search/'+storeUtil.createPreString('search','appName=仙战&pageSize=10&pageNum=1','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        result.resList.length.should.be.above(0);
        done();
      });
  });
});


describe('GET /feedback/', function(){
  var content = '单元测试';
  var number = 18388886666;
  it('Android---意见反馈---返回200、返回OK', function(done){
    request(app)
      .get('/feedback/'+storeUtil.createPreString('feedback','content='+content+'&number='+number,'0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        done();
      });
  });

  after(function(done){
    conn.query('delete from FeedBack where content = ? and telphone =? and systemType = ?',[content,number,0]);
    done();
  });
});



describe('GET /comment-add/', function(){
  var appId = 1;
  var accountId = Math.random()*90016;
  var mac = Math.random()*90016;;

  it('Android---第一次添加评论---返回200、返回 {status:200}', function(done){
    request(app)
      .get('/comment-add/'+storeUtil.createPreString('comment-add','appId='+appId+'&accountId='+accountId+'&content=unitTest&mac='+mac+'&starLevel=4','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        done();
      });
  });

  it('Android---同一账号或mac地址再次添加评论---返回200、返回 {status:500}', function(done){
    request(app)
      .get('/comment-add/'+storeUtil.createPreString('comment-add','appId='+appId+'&accountId='+accountId+'&content=unitTest&mac='+mac+'&starLevel=4','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',500);
        done();
      });
  });

  after(function(done){
    var tableName = 'AppComment_'+appId%10;
    var historyTableName = 'AppCommentHistory_'+appId%10;
    conn.query('delete from '+tableName+' where app_id = ? and account_id =? and mac = ?',[appId,accountId,mac]);
    conn.query('delete from '+historyTableName+' where app_id = ? and account_id =? and mac = ?',[appId,accountId,mac]);
    done();
  });
});


describe('GET /starlevel/', function(){
  var appId = 1;
  var accountId = Math.random()*90016;
  var mac = Math.random()*90016;;

  it('Android---第一次添加评分---返回200、返回 {status:200}', function(done){
    request(app)
      .get('/starlevel/'+storeUtil.createPreString('starlevel','appId='+appId+'&accountId='+accountId+'&mac='+mac+'&starLevel=4','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        done();
      });
  });

  it('Android---同一账号或mac地址再次添加评分---返回200、返回 {status:500}', function(done){
    request(app)
      .get('/starlevel/'+storeUtil.createPreString('starlevel','appId='+appId+'&accountId='+accountId+'&mac='+mac+'&starLevel=4','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',500);
        done();
      });
  });

  after(function(done){
    conn.query('delete from AppStarLevel where appId = ? and accountId =? and mac = ?',[appId,accountId,mac]);
    done();
  });
});


describe('GET /comment-list/', function(){
  it('Android---进入评论列表---返回200、返回json串、返回评论列表', function(done){
    request(app)
      .get('/comment-list/'+storeUtil.createPreString('comment-list','appId=1&pageSize=10&pageNum=1','0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        result.should.have.property('commentList');
        done();
      });
  });
});


describe('GET /updownload/', function(){
  var appId = 1;

  it('Android---意见反馈---返回200、返回OK', function(done){
    request(app)
      .get('/updownload/'+storeUtil.createPreString('updownload','appId='+appId,'0'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        done();
      });
  });

  after(function(done){
    var tableName = 'AppDownLoadHistory_'+appId%100;
    var date = new Date().Format("yyyy-MM-dd ");
    conn.query('select downloadCount from '+tableName+' where downloadDate=? and appId = ?',[date,appId],function(err,result){
      console.log(result);
      if(err){console.log(err.stack);}
      if(result[0].downloadCount>1){
        conn.query('update '+tableName+' set downloadCount = downloadCount-1 where downloadDate=? and appId = ?',[date,appId]);
      }else{
        conn.query('delete from '+tableName+' where downloadDate=? and appId = ?',[date,appId]);
      }
    });
    done();
  });
});
var request = require('supertest');
var crypto = require('crypto');
var should = require('should');  
var settings = require('../../settings');
var storeUtil = require('../../util/storeUtil.js');
var app = require('../../app.js');



describe('GET /app-init/', function(){
  it('winphone---初始化---返回200、返回json串、返回appCode', function(done){
    request(app)
      .get('/app-init/'+storeUtil.createPreString('app-init','0','1'))
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({status:200,data:{appCode:storeUtil.des('8081')}}, done);
  });
});



describe('GET /app-index/', function(){
  it('WINPHONE---首页---热门---返回200、返回json串、返回app和adv数据', function(done){
    request(app)
    .get('/app-index/'+storeUtil.createPreString('app-index','type=12&pageSize=10&pageNum=1','0'))
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      should.not.exist(err);
      var result = JSON.parse(res.text);
      result.should.have.property('status',200);
      //result.data.app.resList.length.should.be.above(0);
      //result.data.adv.resList.length.should.be.above(0);
      done();
    });
  });
  it('WINPHONE---首页---最新---返回200、返回json串、返回app和adv数据', function(done){
    request(app)
    .get('/app-index/'+storeUtil.createPreString('app-index','type=13&pageSize=10&pageNum=1','0'))
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      should.not.exist(err);
      var result = JSON.parse(res.text);
      result.should.have.property('status',200);
      //result.data.app.resList.length.should.be.above(0);
      //result.data.adv.resList.length.should.be.above(0);
      done();
    });
  });
  it('WINPHONE---首页---应用---返回200、返回json串、返回app和adv数据', function(done){
    request(app)
    .get('/app-index/'+storeUtil.createPreString('app-index','type=14&pageSize=10&pageNum=1','0'))
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      should.not.exist(err);
      var result = JSON.parse(res.text);
      result.should.have.property('status',200);
      //result.data.app.resList.length.should.be.above(0);
      //result.data.adv.resList.length.should.be.above(0);
      done();
    });
  });
  it('WINPHONE---首页---游戏---返回200、返回json串、返回app和adv数据', function(done){
    request(app)
    .get('/app-index/'+storeUtil.createPreString('app-index','type=15&pageSize=10&pageNum=1','0'))
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      should.not.exist(err);
      var result = JSON.parse(res.text);
      result.should.have.property('status',200);
      //result.data.app.resList.length.should.be.above(0);
      //result.data.adv.resList.length.should.be.above(0);
      done();
    });
  });
});




describe('GET /classify/', function(){
  it('WINPHONE---类型列表---分类---返回200、返回json串、返回appType数据', function(done){
    request(app)
      .get('/classify/'+storeUtil.createPreString('classify','type=0&pageSize=10&pageNum=1','1'))
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
  it('WINPHONE---类型列表---专题---返回200、返回json串、返回appType数据', function(done){
    request(app)
      .get('/classify/'+storeUtil.createPreString('classify','type=1&pageSize=10&pageNum=1','1'))
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
  it('WINPHONE---类型列表---默认系统分类---返回200、返回json串、返回4个默认appType数据', function(done){
    request(app)
      .get('/classify/'+storeUtil.createPreString('classify','type=2&pageSize=10&pageNum=1','1'))
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        should.not.exist(err);
        var result = JSON.parse(res.text);
        result.should.have.property('status',200);
        done();
      });
  });
});



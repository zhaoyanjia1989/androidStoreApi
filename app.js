var log4js = require('log4js');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var util = require('util');
var routes = require('./routes/index');
var settings = require('./settings');
var connection  = require('express-myconnection'); 
var mysql = require('mysql');
var fs = require('fs');
var app = express();
var log = log4js.getLogger("app");

// 设置试图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 设置常用配置
app.use(favicon(__dirname + '/favicon.ico'));
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// 数据库链接
app.use(
    connection(mysql,{
        host: settings.host,
        user: settings.user,
        password : settings.password,
        port : settings.port, 
        database:settings.database,
        multipleStatements: true
    },'pool')
);

// 设置路由
app.use('/', routes);

// 404页面
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// 开发模式错误拦截
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        log.error("Error:", err.stack);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 产品模式错误拦截
app.use(function(err, req, res, next) {
    log.error("Error:", err.stack);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var mainFeedRouter = require('./routes/1');
var groupRouter = require('./routes/2');
var groupManagerRouter = require('./routes/3');
var viewUserRouter = require('./routes/4');

// database initialisation
var sql = require('mysql');
var databasePool = sql.createPool({
    host: 'localhost',
    database: 'database',
});

var app = express();

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'html');

// declare database
app.use(function(req, res, next) {
    req.pool = databasePool;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainFeedRouter);
app.use('/group', groupRouter);
app.use('/groupManager', groupManagerRouter);
app.use('/Users', viewUserRouter);

module.exports = app;


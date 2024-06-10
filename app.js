var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var mainFeedRouter = require('./routes/1');
var signinRouter = require('./routes/10');
var signupRouter = require('./routes/13');
var myProfile = require('./routes/15');
var contactDetails = require('./routes/16');

var sql = require('mysql');
var databasePool = sql.createPool({
    host: "localhost",
    database: "uDatabase"
});

var app = express();

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'html');

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
app.use('/Signin', signinRouter);
app.use('/SignUp', signupRouter);
app.use('/myProfile', myProfile);
app.use('/contactDetails', contactDetails);

module.exports = app;
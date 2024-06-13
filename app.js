var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var mainFeedRouter = require('./routes/1');
var groupRouter = require('./routes/2');
var groupManagerRouter = require('./routes/3');
var viewUserRouter = require('./routes/4');
var viewEventRouter = require('./routes/5');
var editEventRouter = require('./routes/6');
var editPostRouter = require('./routes/7');
var viewMyOrgsRouter = require('./routes/9');
var EmailRouter = require('./routes/11');
var signinRouter = require('./routes/10');
var signupRouter = require('./routes/13');
var myProfile = require('./routes/15');
var contactDetails = require('./routes/16');
var viewAdminOrgsRouter = require('./routes/18');
var viewPendingOrgsRouter = require('./routes/19');
var viewBranchOrgsRouter = require('./routes/20');
var createNewOrgRouter = require('./routes/21');

// database initialisation
var sql = require('mysql');
var databasePool = sql.createPool({
    host: "localhost",
    database: "uDatabase"
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
app.use('/Email', EmailRouter);
app.use('/Users', viewUserRouter);
app.use('/Event', viewEventRouter);
app.use('/editEvent', editEventRouter);
app.use('/editPost', editPostRouter);
app.use('/viewMyOrgs', viewMyOrgsRouter);
app.use('/Signin', signinRouter);
app.use('/SignUp', signupRouter);
app.use('/myProfile', myProfile);
app.use('/contactDetails', contactDetails);
app.use('/viewAdminOrgs',viewAdminOrgsRouter);
app.use('/viewPendingOrgs', viewPendingOrgsRouter);
app.use('/viewBranchOrgs', viewBranchOrgsRouter);
app.use('/createNewOrg', createNewOrgRouter);

module.exports = app;
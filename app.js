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
var viewEventsRouter = require('./routes/8');
var viewMyOrgsRouter = require('./routes/9');
var signinRouter = require('./routes/10');
var EmailRouter = require('./routes/11');
var signupRouter = require('./routes/13');
var myProfile = require('./routes/15');
var contactDetails = require('./routes/16');
var termsandConditionsRouter = require('./routes/17');
var viewAdminOrgsRouter = require('./routes/18');
var viewPendingOrgsRouter = require('./routes/19');
var viewBranchOrgsRouter = require('./routes/20');
var createNewOrgRouter = require('./routes/21');

var dropdownRouter = require('./routes/dropdown');
var settingsSidebarRouter = require('./routes/settingsSidebar');

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
app.use(function (req, res, next) {
    req.pool = databasePool;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// check for valid userID
app.use(function (req, res, next) {
    if (!(typeof req.cookies.userID === 'undefined')) {
        req.pool.getConnection((error, connection) => {
            if (error) {
                res.send(500);
            }
            var query = "SELECT UserID FROM Users WHERE UserID = UNHEX(?)";
            connection.query(query, [req.cookies.userID], function (err, cookieValidity) {
                connection.release();
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                if (typeof cookieValidity[0] === 'undefined') {
                    res.clearCookie("userID");
                }
            });
        });
    }
    next();
});

// serve content based on permission level
app.use(function (req, res, next) {
    if (!(typeof req.cookies.userID === 'undefined')) {
        req.pool.getConnection((error, connection) => {
            if (error) {
                res.send(500);
            }
            var query = "SELECT UserLevel FROM GroupJoin WHERE UserID = UNHEX(?) ORDER BY UserLevel DESC LIMIT 1";
            connection.query(query, [req.cookies.userID], function (err, UserLevel) {
                connection.release();
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                req.level = UserLevel[0].UserLevel;
                next();
            });
        });
    } else {
        req.level = 0;
        next();
    }
});

app.use('/', mainFeedRouter);
app.use('/group', groupRouter);
app.use('/groupManager', groupManagerRouter);
app.use('/viewUsers', viewUserRouter);
app.use('/Event', viewEventRouter);
app.use('/editEvent', editEventRouter);
app.use('/editPost', editPostRouter);
app.use('/viewEvents', viewEventsRouter);
app.use('/viewMyOrgs', viewMyOrgsRouter);
app.use('/Signin', signinRouter);
app.use('/Email', EmailRouter);
app.use('/SignUp', signupRouter);
app.use('/myProfile', myProfile);
app.use('/contactDetails', contactDetails);
app.use('/termsAndConditions', termsandConditionsRouter);
app.use('/viewAdminOrgs', viewAdminOrgsRouter);
app.use('/viewPendingOrgs', viewPendingOrgsRouter);
app.use('/viewBranchOrgs', viewBranchOrgsRouter);
app.use('/createNewOrg', createNewOrgRouter);

app.use('/dropdown', dropdownRouter);
app.use('/settingsSidebar', settingsSidebarRouter);

module.exports = app;
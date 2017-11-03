const express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    _logger = require('morgan'),
    config = require('./config'),
    options = {
        host: config.db.sessions.host,
        port: config.db.sessions.port,
        user: config.db.sessions.user,
        password: config.db.sessions.password,
        database: config.db.sessions.database,
    },
    logger = require('./middleware/logger').logger(path.basename(__filename)),
    log = require('./middleware/logger').log,
    app = express(),
    MySQLStore = require('express-mysql-session')(session);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: config.secret,
    key: config.key,
    store: new MySQLStore(options)
}));
let routes = require('./routes/main')(app);


app.use(_logger('dev'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler  
app.use(function (err, req, res, next) {
    log("INFO", "лезут куда не поподя", {error: err, url: req.url});
    res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err :{};
	res.status(err.status || 500);
	res.render('error');
    //console.log(err);
    //res.redirect('./');
});


module.exports = app;

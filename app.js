'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var http = require('http');
var path = require('path');
var request = require('request');
var routes = require('./routes');
var activity = require('./routes/activity');

var app = express();


app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json({ type: 'application/json' }));

app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(errorhandler());
}


app.get('/', routes.index);
app.post('/login', routes.login);
app.post('/logout', routes.logout);

app.post('/check/save/', activity.save);
app.post('/check/validate/', activity.validate);
app.post('/check/publish/', activity.publish);
app.post('/check/execute/', activity.execute);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

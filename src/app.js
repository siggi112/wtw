'use strict';
var express = require('express');
var parser = require('body-parser');
var api = require('./routes/api');
const router = require('./routes/main');
var jsonfile = require('jsonfile');
var MovieDB = require('moviedb')('2995c4d29964c4f4d7b83ac88023d4c3');

var app = express();


app.use('/', express.static('public'));
app.use(parser.json());


// view setup
app.set('view engine', 'ejs');


app.use('/', router);
app.use('/api', api);

var port = 3001;        // set our port

app.listen(port);

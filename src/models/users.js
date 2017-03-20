'use strict';

var mongoose = require('mongoose');

var Userschema = new mongoose.Schema({

	name: String,
	email: String,
	favoriteMovies: Array

});

var model = mongoose.model('Users', Userschema);


module.exports = model;
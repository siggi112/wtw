'use strict';

var express = require('express');
var jsonfile = require('jsonfile')
var MovieDB = require('moviedb')('2995c4d29964c4f4d7b83ac88023d4c3');
var router = express.Router();
var jsonConcat = require("json-concat");
var adventureMovies = require('../../data/genre/adventure/allMovies.json');
var actionMovies = require('../../data/genre/action/allMovies.json');
var animationMovies = require('../../data/genre/animation/allMovies.json');
var comedyMovies = require('../../data/genre/comedy/allMovies.json');
var crimeMovies = require('../../data/genre/crime/allMovies.json');
var documentaryMovies = require('../../data/genre/documentary/allMovies.json');
var dramaMovies = require('../../data/genre/drama/allMovies.json');
var familyMovies = require('../../data/genre/family/allMovies.json');
var fantasyMovies = require('../../data/genre/fantasy/allMovies.json');
var foreignMovies = require('../../data/genre/foreign/allMovies.json');
var historyMovies = require('../../data/genre/history/allMovies.json');
var horrorMovies = require('../../data/genre/horror/allMovies.json');
var musicMovies = require('../../data/genre/music/allMovies.json');
var mysteryMovies = require('../../data/genre/mystery/allMovies.json');
var romanceMovies = require('../../data/genre/romance/allMovies.json');
var sciencefictionMovies = require('../../data/genre/sciencefiction/allMovies.json');
var tvmovieMovies = require('../../data/genre/tvmovie/allMovies.json');
var warMovies = require('../../data/genre/war/allMovies.json');
var westernMovies = require('../../data/genre/western/allMovies.json');
var thrillerMovies = require('../../data/genre/thriller/allMovies.json');
var popularMovies = require('../../data/popular/allMovies.json');
var topratedMovies = require('../../data/toprated/allMovies.json');

// ROUTES FOR POPULAR AND TOP RATED
router.get('/movies/popular', function(request, response) {
		response.json(popularMovies);
	});

router.get('/movies/toprated', function(request, response) {
		response.json(topratedMovies);
	});


// ROUTES FOR GENRES
	router.get('/movies/genre/action', function(request, response) {
		response.json(actionMovies);
	});

	router.get('/movies/genre/adventure', function(request, response) {
		response.json(adventureMovies);
	});

	router.get('/movies/genre/animation', function(request, response) {
		response.json(animationMovies);
	});

	router.get('/movies/genre/comedy', function(request, response) {
		response.json(comedyMovies);
	});

	router.get('/movies/genre/crime', function(request, response) {
		response.json(crimeMovies);
	});

	router.get('/movies/genre/documentary', function(request, response) {
		response.json(documentaryMovies);
	});

	router.get('/movies/genre/drama', function(request, response) {
		response.json(dramaMovies);
	});

	router.get('/movies/genre/family', function(request, response) {
		response.json(familyMovies);
	});

	router.get('/movies/genre/fantasy', function(request, response) {
		response.json(fantasyMovies);
	});

	router.get('/movies/genre/foreign', function(request, response) {
		response.json(foreignMovies);
	});

	router.get('/movies/genre/history', function(request, response) {
		response.json(historyMovies);
	});

	router.get('/movies/genre/horror', function(request, response) {
		response.json(horrorMovies);
	});

	router.get('/movies/genre/music', function(request, response) {
		response.json(musicMovies);
	});

	router.get('/movies/genre/mystery', function(request, response) {
		response.json(mysteryMovies);
	});

	router.get('/movies/genre/romance', function(request, response) {
		response.json(romanceMovies);
	});

	router.get('/movies/genre/sciencefiction', function(request, response) {
		response.json(sciencefictionMovies);
	});

	router.get('/movies/genre/tvmovies', function(request, response) {
		response.json(tvmovieMovies);
	});

	router.get('/movies/genre/war', function(request, response) {
		response.json(warMovies);
	});

	router.get('/movies/genre/western', function(request, response) {
		response.json(westernMovies);
	});

	router.get('/movies/genre/thriller', function(request, response) {
		response.json(thrillerMovies);
	});


router.post('/users', function(request, response) {
	var movie = request.body;
	Movie.create(movie, function(error, movie){
		if(error) {
			return response.status(500).json({error: error.message});
		}
			response.json({'movie': movie, message: 'Movie Stored!'});
	});
});


router.put('/users/:id', function(request, response) {
	var id = request.params.id;
	var movie = request.body;
	if(movie && movie._id !== id){
		return response.status(500).json({error: "Ids don't match!"});
	}
	Movie.findByIdAndUpdate(id, movie, {new: true},function(error, movie){
		if(error) {
			return response.status(500).json({error: error.message});
		}
			response.json({'movie': movie, message: 'Movie Updated!'});
	});
});

var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '00 30 05 * * 0-6',
  onTick: function() {

					// WRITE OUT JSON FOR POPULAR MOVIES
					var popularPage = 0;
					var popularObject = [];
					var popularInterval = {};
					var popularApiCall = function(){
					    if(popularPage <= 100) {
					          popularPage++;
					          console.log(popularPage);
					          MovieDB.miscPopularMovies({page: popularPage}, function(error, response){
									var popularmovies = response;
									popularObject.push(popularmovies);
						  			});
					     } else {
					     	var file = './data/popular/allMovies.json';
					     	jsonfile.writeFileSync(file, popularObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(popularInterval);
					     }
					  };

					popularInterval = setInterval(popularApiCall, 500);

					// WRITE OUT JSON FOR TOP RATED MOVIES
					var topratedPage = 0;
					var topratedObject = [];
					var topratedInterval = {};
					var topratedApiCall = function(){
					    if(topratedPage <= 100) {
					          topratedPage++;
					          console.log(topratedPage);
					          MovieDB.miscTopRatedMovies({page: topratedPage}, function(error, response){
									var topratedMovies = response;
									topratedObject.push(topratedMovies);
						  			});
					     } else {
					     	var file = './data/toprated/allMovies.json';
					     	jsonfile.writeFileSync(file, topratedObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(topratedInterval);
					     }
					  };

					topratedInterval = setInterval(topratedApiCall, 1000);




					// WRITE OUT JSON FOR ADVENTURE MOVIES
					var adventurePage = 0;
					var adventureObject = [];
					var myInterval = {};
					var adventureapiCalls = function(){
					    if(adventurePage <= 100) {
					          adventurePage++;
					          console.log(adventurePage);
					          MovieDB.genreMovies({id: 12, page: adventurePage}, function(error, response){
									var adventureMovies = response;
									adventureObject.push(adventureMovies);
						  			});
					     } else {
					     	var file = './data/genre/adventure/allMovies.json';
					     	jsonfile.writeFileSync(file, adventureObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(myInterval);
					     }
					  };
					myInterval = setInterval(adventureapiCalls, 1500);

					// WRITE OUT JSON FOR ACTION MOVIES
					var actionPage = 0;
					var actionObject = [];
					var actionPagemyInterval = {};
					var actionapiCalls = function(){
					    if(actionPage <= 100) {
					          actionPage++;
					          console.log(actionPage);
					          MovieDB.genreMovies({id: 28, page: actionPage}, function(error, response){
									var actionMovies = response;
									actionObject.push(actionMovies);
						  			});
					     } else {
					     	var file = './data/genre/action/allMovies.json';
					     	jsonfile.writeFileSync(file, actionObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(actionPagemyInterval);
					     }
					  };
					actionPagemyInterval = setInterval(actionapiCalls, 2000);

					// WRITE OUT JSON FOR ANIMATION MOVIES
					var animationPage = 0;
					var animationObject = [];
					var animationInterval = {};
					var animationApiCalls = function(){
					    if(animationPage <= 100) {
					          animationPage++;
					          console.log(animationPage);
					          MovieDB.genreMovies({id: 16, page: animationPage}, function(error, response){
									var animationMovies = response;
									animationObject.push(animationMovies);
						  			});
					     } else {
					     	var file = './data/genre/animation/allMovies.json';
					     	jsonfile.writeFileSync(file, animationObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(animationInterval);
					     }
					  };
					animationInterval = setInterval(animationApiCalls, 2500);

  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();


var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '00 40 05 * * 0-6',
  onTick: function() {

					// WRITE OUT JSON FOR COMEDY MOVIES
					var comedyPage = 0;
					var comedyObject = [];
					var comedyinterval = {};
					var comedyapiCall = function(){
					    if(comedyPage <= 100) {
					          comedyPage++;
					          console.log(comedyPage);
					          MovieDB.genreMovies({id: 35, page: comedyPage}, function(error, response){
									var comedyMovies = response;
									comedyObject.push(comedyMovies);
						  			});
					     } else {
					     	var file = './data/genre/comedy/allMovies.json';
					     	jsonfile.writeFileSync(file, comedyObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(comedyinterval);
					     }
					  };
					comedyinterval = setInterval(comedyapiCall, 500);

					// WRITE OUT JSON FOR CRIME MOVIES
					var crimePage = 0;
					var crimeObjects = [];
					var crimeInterval = {};
					var crimeapiCall = function(){
					    if(crimePage <= 100) {
					          crimePage++;
					          console.log(crimePage);
					          MovieDB.genreMovies({id: 80, page: crimePage}, function(error, response){
									var crimeMovies = response;
									crimeObjects.push(crimeMovies);
						  			});
					     } else {
					     	var file = './data/genre/crime/allMovies.json';
					     	jsonfile.writeFileSync(file, crimeObjects,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(crimeInterval);
					     }
					  };
					crimeInterval = setInterval(crimeapiCall, 1000);

					// WRITE OUT JSON FOR DOCUMENTARY MOVIES
					var documentaryPage = 0;
					var documentaryObject = [];
					var documentaryInterval = {};
					var documentaryApiCall = function(){
					    if(documentaryPage <= 100) {
					          documentaryPage++;
					          console.log(documentaryPage);
					          MovieDB.genreMovies({id: 99, page: documentaryPage}, function(error, response){
									var documentaryMovies = response;
									documentaryObject.push(documentaryMovies);
						  			});
					     } else {
					     	var file = './data/genre/documentary/allMovies.json';
					     	jsonfile.writeFileSync(file, documentaryObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(documentaryInterval);
					     }
					  };
					documentaryInterval = setInterval(documentaryApiCall, 1500);

					// WRITE OUT JSON FOR DRAMA MOVIES
					var dramaPage = 0;
					var dramaObject = [];
					var dramaInterval = {};
					var dramaApiCall = function(){
					    if(dramaPage <= 100) {
					          dramaPage++;
					          console.log(dramaPage);
					          MovieDB.genreMovies({id: 18, page: dramaPage}, function(error, response){
									var dramaMovies = response;
									dramaObject.push(dramaMovies);
						  			});
					     } else {
					     	var file = './data/genre/drama/allMovies.json';
					     	jsonfile.writeFileSync(file, dramaObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(dramaInterval);
					     }
					  };
					dramaInterval = setInterval(dramaApiCall, 2000);

					// WRITE OUT JSON FOR FAMILY MOVIES
					var familyPage = 0;
					var familyObject = [];
					var familyInterval = {};
					var familyApiCall = function(){
					    if(familyPage <= 100) {
					          familyPage++;
					          console.log(familyPage);
					          MovieDB.genreMovies({id: 10751, page: familyPage}, function(error, response){
									var familyMovies = response;
									familyObject.push(familyMovies);
						  			});
					     } else {
					     	var file = './data/genre/family/allMovies.json';
					     	jsonfile.writeFileSync(file, familyObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(familyInterval);
					     }
					  };
					familyInterval = setInterval(familyApiCall, 2500);
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();


var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '00 50 05 * * 0-6',
  onTick: function() {


					// WRITE OUT JSON FOR FANTASY MOVIES
					var fantasyPage = 0;
					var fantasyObject = [];
					var fantasyInterval = {};
					var fantasyApiCall = function(){
					    if(fantasyPage <= 100) {
					          fantasyPage++;
					          console.log(fantasyPage);
					          MovieDB.genreMovies({id: 14, page: fantasyPage}, function(error, response){
									var fantasyMovies = response;
									fantasyObject.push(fantasyMovies);
						  			});
					     } else {
					     	var file = './data/genre/fantasy/allMovies.json';
					     	jsonfile.writeFileSync(file, fantasyObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(fantasyInterval);
					     }
					  };
					fantasyInterval = setInterval(fantasyApiCall, 500);

					// WRITE OUT JSON FOR FOREIGN MOVIES
					var foreignPage = 0;
					var foreignObject = [];
					var foreignInterval = {};
					var foreignApiCall = function(){
					    if(foreignPage <= 100) {
					          foreignPage++;
					          console.log(foreignPage);
					          MovieDB.genreMovies({id: 10769, page: foreignPage}, function(error, response){
									var foreignMovies = response;
									foreignObject.push(foreignMovies);
						  			});
					     } else {
					     	var file = './data/genre/foreign/allMovies.json';
					     	jsonfile.writeFileSync(file, foreignObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(foreignInterval);
					     }
					  };
					foreignInterval = setInterval(foreignApiCall, 1000);

					// WRITE OUT JSON FOR HISTORY MOVIES
					var historyPage = 0;
					var historyObject = [];
					var historyInterval = {};
					var historyApiCall = function(){
					    if(historyPage <= 100) {
					          historyPage++;
					          console.log(historyPage);
					          MovieDB.genreMovies({id: 36, page: historyPage}, function(error, response){
									var historyMovies = response;
									historyObject.push(historyMovies);
						  			});
					     } else {
					     	var file = './data/genre/history/allMovies.json';
					     	jsonfile.writeFileSync(file, historyObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(historyInterval);
					     }
					  };
					historyInterval = setInterval(historyApiCall, 1500);

					// WRITE OUT JSON FOR HORROR MOVIES
					var horrorPage = 0;
					var horrorObject = [];
					var horrorInterval = {};
					var horrorApiCall = function(){
					    if(horrorPage <= 100) {
					          horrorPage++;
					          console.log(horrorPage);
					          MovieDB.genreMovies({id: 27, page: horrorPage}, function(error, response){
									var horrorMovies = response;
									horrorObject.push(horrorMovies);
						  			});
					     } else {
					     	var file = './data/genre/horror/allMovies.json';
					     	jsonfile.writeFileSync(file, horrorObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(horrorInterval);
					     }
					  };
					horrorInterval = setInterval(horrorApiCall, 2000);

					// WRITE OUT JSON FOR MUSIC MOVIES
					var musicPage = 0;
					var musicObject = [];
					var musicInterval = {};
					var musicApiCall = function(){
					    if(musicPage <= 100) {
					          musicPage++;
					          console.log(musicPage);
					          MovieDB.genreMovies({id: 10402, page: musicPage}, function(error, response){
									var musicMoives = response;
									musicObject.push(musicMoives);
						  			});
					     } else {
					     	var file = './data/genre/music/allMovies.json';
					     	jsonfile.writeFileSync(file, musicObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(musicInterval);
					     }
					  };
					musicInterval = setInterval(musicApiCall, 2500);

  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();



var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '00 00 06 * * 0-6',
  onTick: function() {


					// WRITE OUT JSON FOR MYSTERY MOVIES
					var mysteryPage = 0;
					var mysteryObject = [];
					var mysteryInterval = {};
					var mysteryApiCall = function(){
					    if(mysteryPage <= 100) {
					          mysteryPage++;
					          console.log(mysteryPage);
					          MovieDB.genreMovies({id: 9648, page: mysteryPage}, function(error, response){
									var mysteryMovies = response;
									mysteryObject.push(mysteryMovies);
						  			});
					     } else {
					     	var file = './data/genre/mystery/allMovies.json';
					     	jsonfile.writeFileSync(file, mysteryObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(mysteryInterval);
					     }
					  };
					mysteryInterval = setInterval(mysteryApiCall, 500);

					// WRITE OUT JSON FOR ROMANCE MOVIES
					var romancePage = 0;
					var romanceObject = [];
					var romanceInterval = {};
					var romanceApiCall = function(){
					    if(romancePage <= 100) {
					          romancePage++;
					          console.log(romancePage);
					          MovieDB.genreMovies({id: 10749, page: romancePage}, function(error, response){
									var romanceMovies = response;
									romanceObject.push(romanceMovies);
						  			});
					     } else {
					     	var file = './data/genre/romance/allMovies.json';
					     	jsonfile.writeFileSync(file, romanceObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(romanceInterval);
					     }
					  };
					romanceInterval = setInterval(romanceApiCall, 1000);


					// WRITE OUT JSON FOR SCIENCE FICTION MOVIES
					var sciencePage = 0;
					var scienceObject = [];
					var scienceInterval = {};
					var scienceApiCall = function(){
					    if(sciencePage <= 100) {
					          sciencePage++;
					          console.log(sciencePage);
					          MovieDB.genreMovies({id: 878, page: sciencePage}, function(error, response){
									var scienceMovies = response;
									scienceObject.push(scienceMovies);
						  			});
					     } else {
					     	var file = './data/genre/sciencefiction/allMovies.json';
					     	jsonfile.writeFileSync(file, scienceObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(scienceInterval);
					     }
					  };
					scienceInterval = setInterval(scienceApiCall, 1500);

					// WRITE OUT JSON FOR THRILLER MOVIES
					var thrillerPage = 0;
					var thrillerObject = [];
					var thrillerInterval = {};
					var thrillerApiCall = function(){
					    if(thrillerPage <= 100) {
					          thrillerPage++;
					          console.log(thrillerPage);
					          MovieDB.genreMovies({id: 53, page: thrillerPage}, function(error, response){
									var thrillerMovies = response;
									thrillerObject.push(thrillerMovies);
						  			});
					     } else {
					     	var file = './data/genre/thriller/allMovies.json';
					     	jsonfile.writeFileSync(file, thrillerObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(thrillerInterval);
					     }
					  };
					thrillerInterval = setInterval(thrillerApiCall, 2000);

					// WRITE OUT JSON FOR TV MOVIES MOVIES
					var tvmoviesPage = 0;
					var tvmoviesObject = [];
					var tvmoviesInterval = {};
					var tvmovieApiCall = function(){
					    if(tvmoviesPage <= 100) {
					          tvmoviesPage++;
					          console.log(tvmoviesPage);
					          MovieDB.genreMovies({id: 10770, page: tvmoviesPage}, function(error, response){
									var tvmMovies = response;
									tvmoviesObject.push(tvmMovies);
						  			});
					     } else {
					     	var file = './data/genre/tvmovie/allMovies.json';
					     	jsonfile.writeFileSync(file, tvmoviesObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(tvmoviesInterval);
					     }
					  };
					tvmoviesInterval = setInterval(tvmovieApiCall, 2500);

  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();



var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '00 10 06 * * 0-6',
  onTick: function() {


					// WRITE OUT JSON FOR WESTERN MOVIES
					var westernPage = 0;
					var westernObject = [];
					var westernInterval = {};
					var westernApiCall = function(){
					    if(westernPage <= 100) {
					          westernPage++;
					          console.log(westernPage);
					          MovieDB.genreMovies({id: 37, page: westernPage}, function(error, response){
									var westernMovies = response;
									westernObject.push(westernMovies);
						  			});
					     } else {
					     	var file = './data/genre/western/allMovies.json';
					     	jsonfile.writeFileSync(file, westernObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(westernInterval);
					     }
					  };
					westernInterval = setInterval(westernApiCall, 500);


					// WRITE OUT JSON FOR WAR MOVIES
					var warmoviePage = 0;
					var warmovieObject = [];
					var warInterval = {};
					var warApiCall = function(){
					    if(warmoviePage <= 100) {
					          warmoviePage++;
					          console.log(warmoviePage);
					          MovieDB.genreMovies({id: 10752, page: warmoviePage}, function(error, response){
									var warMovies = response;
									warmovieObject.push(warMovies);
						  			});
					     } else {
					     	var file = './data/genre/war/allMovies.json';
					     	jsonfile.writeFileSync(file, warmovieObject,{spaces: 2}, function (err) {
							console.error(err)
							});
					        clearInterval(warInterval);
					     }
					  };
					warInterval = setInterval(warApiCall, 1000);

  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();







// CRON JOBS TO GET MOVIES
// =============================================================================


module.exports = router;

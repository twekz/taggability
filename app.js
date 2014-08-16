var express = require('express');
var	passport = require('passport');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var	jade = require('jade');
var	readability = require('readability-api');
var	fs = require('fs');
var	ReadabilityStrategy = require('passport-readability').Strategy;

var app = express();


// Configure Express
// =================

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));


// Configure keys & callback URL
// =============================

var READABILITY_API_KEY;
var READABILITY_API_SECRET;
var CALLBACK_URL;

if (fs.existsSync('./config.json')) {

	var config = fs.readFileSync('./config.json');

	// API keys definition

	READABILITY_API_KEY = JSON.parse(config).key;
	READABILITY_API_SECRET = JSON.parse(config).secret;


	// Callback URL definition

	if(typeof JSON.parse(config).url == 'undefined'){
		CALLBACK_URL = "localhost:" + app.get('port'); // localhost
	} else {
		CALLBACK_URL = JSON.parse(config).url;
	}

} else {
	throw new Error("config.json was not found.")
}




// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Readability profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});








// Use the ReadabilityStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Readability profile),
//   and invoke a callback with a user object.


// Declare access_token & access_token_secret before authentication.
var access_token = null,
	access_token_secret = null;

// Strategy
passport.use(new ReadabilityStrategy({
	consumerKey: READABILITY_API_KEY,
	consumerSecret: READABILITY_API_SECRET,
	callbackURL: "http://" + CALLBACK_URL + "/auth/readability/callback"
},
function(token, tokenSecret, profile, done) {
	// console.log('access_token: ' + token);
	// console.log('access_token_secret: ' + tokenSecret);
	access_token = token;
	access_token_secret = tokenSecret;

	createReader(token, tokenSecret);

	// asynchronous verification, for effect...
	process.nextTick(function () {
		
	  // To keep the example simple, the user's Readability profile is returned
	  // to represent the logged-in user.  In a typical application, you would
	  // want to associate the Readability account with a user record in your
	  // database, and return that user instead.
	  return done(null, profile);
	});
}
));



readability.configure({
	consumer_key: READABILITY_API_KEY,
	consumer_secret: READABILITY_API_SECRET
});


var reader;
var createReader = function(token, tokenSecret){
	reader = new readability.reader({
		access_token: access_token,
		access_token_secret: access_token_secret
	});
	console.log('Reader created.')
}






// Routes
// ======



// app.get('/account', ensureAuthenticated, function(req, res){
//   res.render('account', { user: req.user });
// });

app.get('/login', function(req, res){
	res.render('login', {
	// scripts: ['jquery.min.js', 'script.js'],
	user: req.user
});
});
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});



var countTotalPages = function(bookmarksTotal, display){
	var totalPages = Math.ceil(bookmarksTotal/display);
	return totalPages;
};

var nextPage = function(current, total){
	if (current < total){
		return current+1;
	} else if (current > total){
		return current-1;
	} else {
		return null;
	}
};

var prevPage = function(current, total){
	if (current > total){
		return current+1;
	} else if (current <= total){
		return current-1;
	} else {
		return null;
	}
};



app.get('/bookmarks/page/:pagenb', ensureAuthenticated, function(req, res){
	// var pageNb = req.params.pageNb;
	if(req.params.pagenb){
		console.log('APP.GET /bookmarks/page/:pageNb with req.url= ' + req.url);
		var pagenb = parseInt(req.params.pagenb);
		reader.bookmarks({'page' : pagenb}, function(err, body){
			if(err){
				console.log(err + ' from APP');
		// console.log(bookmarks.conditions);
		// res.end();
	} else {
		console.log('ok, render.');
		var bookmarksTotal = JSON.stringify(body.meta.item_count_total);

		  // Pagination variables => Object ??!
		  var total_pages = countTotalPages(bookmarksTotal, body.conditions.per_page);
		  var current_page = body.meta.page;
		  var prev_page = prevPage(current_page, total_pages);
		  var next_page = nextPage(current_page, total_pages);


		  res.render('bookmarks', {
			// scripts: ['jquery.min.js', 'script.js'],
			title: 'All bookmarks',
			user: req.user,
			bookmarks: body,
			total: bookmarksTotal,
			current_page: current_page,
			total_pages: total_pages,
			prev_page: prev_page,
			next_page: next_page
		});
		  // res.end();
		}
	})
	} else {
	// if no page number : redirect to page 1 (bookmarks)
	// res.redirect('/bookmarks/page/1');
	console.log('error with parameters')
}
});




// Delete a tag (at user level)
//
//

app.get('/tags/:tagid/delete', ensureAuthenticated, function(req,res){
	if(req.params.tagid){
		reader.removeUserTag(req.params.tagid, function(err, body){
			if(err){
				console.log('error');
				res.end();
			} else {
				console.log('API success - tag deleted.');
				console.log(body);
				res.redirect('/');
				// res.end(JSON.stringify({error: null, tags: req.params.tagid}));
			}
		})
	} else {
		console.log('missing tag id');
	}
});

// app.get('/bookmarks/page', ensureAuthenticated, function(req, res){
//   res.redirect('/bookmarks/page/1');
// });

// app.get('/bookmarks', ensureAuthenticated, function(req, res){
// 	console.log('redirect to /page/1');
//   res.redirect('/bookmarks/page/1');
// });



app.get('/all', ensureAuthenticated, function(req, res){
	res.render('all', {
		// pretty: true,
		user: req.user,
		info: ''
	});
})




// [VIEW] Index

app.get('/', function(req, res){
	if(req.user){
		res.redirect('/all');
		// reader.userTags(function(err, tags){
		// 	if(err){
		// 		console.log('reader.userTags() error: ' + err);
		// 		res.end();
		// 	} else {
		// 		res.render('index', {
		// 			user: req.user,
		// 			tags: tags
		// 		});
		// 	}
		// });
	} else {
		res.render('welcome', {
			user: null
		});
	}
});














// ===================================================================
//		 							[API]
// ===================================================================




// Render a page of bookmarks
// --------------------------


var renderSingleContent = function(res, locals){
	return res.render('single_bookmark_content', locals);
}

var renderPartial = function(res, locals){
	return res.render('bookmark-list', locals);
}


app.get('/api/ajax/bookmarks/page/:page', ensureAuthenticated, function(req, res){
	if(req.params.page){
		reader.bookmarks({'page' : req.params.page}, function(err, body){
			if(err){
				console.log(err);
				res.end();
			} else {
				console.log(body.bookmarks.length + ' elements (page ' + body.meta.page + ')');
				var bookmarksTotal = JSON.stringify(body.meta.item_count_total);

			// Pagination variables => Object ??!
			var total_pages = countTotalPages(bookmarksTotal, body.conditions.per_page);
			var current_page = body.meta.page;
			var prev_page = prevPage(current_page, total_pages);
			var next_page = nextPage(current_page, total_pages);

			renderPartial(res, {
				user: req.user,
				bookmarks: body.bookmarks,
				current_page: current_page,
				total_pages: total_pages,
				prev_page: prev_page,
				next_page: next_page
			})
			}
		})
	} else {
		console.log('No page number supplied to API');
		// if no page number : redirect to page 1 (bookmarks)
		// res.redirect('/bookmarks');
	}

});







// Return bookmarks meta data
// --------------------------

function getBookmarksData(res){
	reader.bookmarks({}, function (err, body){
		if(err){
			// console.log(err);
			return res.end(null);
		} else {
			return res.end(JSON.stringify(body));
		}
	})
}

app.get('/api/ajax/bookmarks/', ensureAuthenticated, function(req, res){
	getBookmarksData(res);
})





// Render a single bookmark by its ID
// ----------------------------------

app.get('/api/ajax/bookmarks/:id', ensureAuthenticated, function(req, res){
	if(req.params.id){
		reader.bookmark(req.params.id, function(err, body){
			if(err){
				console.log(err);
				res.end();
			} else {
				console.log('Render single bookmark content - id: ' + req.params.id);
				renderSingleContent(res, {
					item: body
				})
			}
		})
	} else {
		console.log("Missing bookmark ID in API.");
	}
})




// Tag bookmarks
// -------------



function firstTagging(ids, idx, newTags, next){
	console.log(ids);
	console.log("idx = " + idx);

	if (idx < ids.length){
		var thisid = ids[idx];

		reader.addTags(thisid, newTags, function(err, tags){
			if(err){
				// if error, try first request with next ID:
				idx = idx + 1;
				return firstTagging(ids, idx, newTags, next);
			} else {
				// if success, tag all IDs
				return next();
			}
		})
	} else {
		// if all IDs return error, do next function to throw user error
		return next();
	}
}

function addTagsToBookmarks(ids, newtags, next){

	for (var i=0; i<ids.length; i++){
		reader.addTags(ids[i], newtags, function (err, tags){
			var returnMessage = {};
			returnMessage.quantity = ids.length;
			if(err){
				returnMessage.error = err;
				returnMessage.data = null;
			} else {
				// tags = JSON.stringify(tags);
				returnMessage.error = null;
				returnMessage.data = JSON.stringify(tags);
			}
			// then pass the returned message to cb
			return next(JSON.stringify(returnMessage));
		})
	}

}

app.post('/api/ajax/bookmarks/:ids/tags/:tags', ensureAuthenticated, function(req, res){

	// check parameters
	if(req.params.ids && req.params.tags){

		// convert parameters
		var tags = req.params.tags;
		var ids = JSON.parse("[" + req.params.ids + "]");
		var inputTags = [req.params.tags];

		if(ids.length == 1){

			// case : single bookmark to edit
			addTagsToBookmarks(ids, inputTags, function(body){
				res.end(body);
				console.log(body);
			});

		} else {

			// case : several bookmarks to edit
			// first request (creating the tags if new)

			firstTagging(ids, 1, inputTags, function(){

				addTagsToBookmarks(ids, inputTags, function(body){
					res.end(body);
					console.log(body);
					// send full response object here !!
				});
			})

		}

	} else {
		console.log('missing ids or tags');
	}
});







// Clear tags from a bookmark
app.post('/api/ajax/bookmarks/:id/cleartags', ensureAuthenticated, function(req, res){
	var thisBookmarkId = req.params.id;
	if(thisBookmarkId){
		// get tags from this bookmark
		reader.tags(thisBookmarkId, function(err, returnTags){
			if(err){
				console.log('This article has no tags to delete -> ' + err);
				res.end();
			} else {
				for (var i=0; i<returnTags.length; i++){
					console.log('Deleting tag ' + returnTags[i].id + ' from article ' + thisBookmarkId);
					reader.removeTag(thisBookmarkId, returnTags[i].id, function(err, done){
						if(done){
							console.log('Successfully deleted tag');
							res.end();
						} else {
							console.log('error deleting tag');
							res.end();
						}
					})
				}
			}
		})
	}
});




// Delete one tag from one bookmark

app.get('/api/bookmarks/:id/tags/:tagid/delete', ensureAuthenticated, function(req, res){
	if(req.params.id && req.params.tagid){
		reader.removeTag(req.params.id, req.params.tagid, function(err, done){
			if(err){
				console.log('Error deleting tag: ' + err);
				res.redirect('/bookmarks');
		// res.end();
	} else {
		console.log('deleted tag');
		res.redirect('/bookmarks');
		// res.end();
	}
})
	}
})





// GET /auth/readability
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Readability authentication will involve
//   redirecting the user to readability.com.  After authorization, Readability
//   will redirect the user back to this application at
//   /auth/readability/callback
app.get('/auth/readability',
	passport.authenticate('readability'),
	function(req, res){
	// The request will be redirected to Readability for authentication, so this
	// function will not be called.
});

// GET /auth/readability/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/readability/callback', 
	passport.authenticate('readability', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	});

app.get('/foo/bar', function(req, res){
	res.render()
})



// 404 handling

app.use(function(req, res){
	res.status(404);
	console.log('404 from app');
	// res.end();
	res.send('Error 404 - Could not find the requested path ' + req.url);
});





app.listen(app.get('port'));
console.log('Server listening on port ' + app.get('port'));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/')
}

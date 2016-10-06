var express = require('express');
var app = express();
var port = process.env.PORT||8000;
var domain = process.env.DOMAIN||'http://localhost:'+port + '/';
var mongoose = require('mongoose');
var ShortUrl = require('./app/models/url');
var urlExists = require('url-exists');
var db_uri = process.env.MONGOLAB_URI;

mongoose.connect(db_uri);

app.use(express.static('public'));

app.get('/new',function(request,response){
	response.json({error: 'Please enter url.'})
});

app.get('/new/:url(*)', function(request, response){
	var url = request.params.url;
	urlExists(url, function(err, exists){
		if(exists){
			ShortUrl.count({},function(err,count){
				if(err) response.send(err);

				var shortUrl = new ShortUrl();
				var id = count+1;

				shortUrl.original_url = url;
				shortUrl.short_url = id;

				shortUrl.save(function(err){
					if(err) response.send(err);

					response.json({
						original_url: url,
						short_url: domain + id
					});
				});
			});
		}else{
			response.json({error: 'Wrong url format, make sure you have a valid protocol and real site.'});
		}
	});
});

app.get('/:url(*)', function(request, response){
	var id = request.params.url;

	ShortUrl.find({short_url: id}, function(err, url){
		if(url.length!==0){
			response.redirect(url[0].original_url);
		}else{
			response.json({error: 'URL does not exist.'});
		}
	})
});

app.listen(port);
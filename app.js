var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
	
	url = 'http://www.imdb.com/title/tt1229340/';
	url2 = 'https://www.zonajobs.com.ar/empleos/area=sistemas-tecnologia-it_ubicacion=santa-fe';

	//computrabajo http://www.computrabajo.com.ar/bt-ofrlistado.htm?BqdPalabras=&BqdComienzo=21&Bqd=%2BST021&Bqd=&Bqd=%2BSC003
	baseURL = 'http://www.computrabajo.com.ar/bt-ofrlistado.htm?';
	page = 'BqdPalabras=&BqdComienzo=1';//+20 to next page
	param1 = '&Bqd=%2BST021';
	param2 = '&Bqd=&Bqd=%2BSC003';
	cturl = baseURL + page + param1 + param2;

	request(url, function(err, response, html){

		if(!err){

			var $ = cheerio.load(html);

			var title, release, rating;
			var json = { title : "", release : "", rating : ""};

			$('.header').filter(function(){
		        var data = $(this);

		        json.title = data.children().first().text();
                json.release = data.children().last().children().text();
	        })

            $('.star-box-giga-star').filter(function(){
	        	var data = $(this);

	        	json.rating = data.text();
	        })
		}
        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1 :  output.json - this is what the created filename will be called
        // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
        // Parameter 3 :  callback function - a callback function to let us know the status of our function

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

        	console.log('File successfully written! - Check your project directory for the output.json file');

        })

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send(JSON.stringify(json, null, 4) + ' Check your console!')
	})
})

app.listen('8080')
console.log('Magic happens on port 8080');
exports = module.exports = app;
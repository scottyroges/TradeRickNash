var fs = require('fs');

var years = ['2014', '2013', '2012'];
var categories = ['cash', 'cap-hit','contract-value'];



var i = 0,
	k = 0;


//cash = Total Salary

function init(){
	loopYears(years, function(){
		console.log("finished looping");
		phantom.exit();
		// connectToMongo(function(){
		//   closeMongoConnection();
		// });
	});
}

init();


function loopYears(years, _cb){
	loopCategories(categories, function(){
        i++;

        // any more items in array? continue loop
        if(i < years.length) {
            loopYears(years,_cb);   
        } else {
        	i = 0;
        	_cb();
        }
	});
}

function loopCategories(categories, _cb){

	pulldata(years[i], categories[k],function(data){
		k++;
        // any more items in array? continue loop
        if(k < categories.length) {
            loopCategories(categories, _cb);   
        } else {
        	k = 0;
        	_cb();
        }
	});
	

}


function pulldata(year, category, _cb){
	console.log("pull data");
	var page = require('webpage').create();

	var path = 'http://www.spotrac.com/nhl/rankings/' + year + '/' + category + '/';
	console.log(path);
	page.open(path);

	page.onLoadFinished = function(status) {
		// console.log("onloadfinished");
  // 		var html = page.evaluate(function () {
	 //        return document.getElementsByTagName('html')[0].innerHTML;
	 //    });
	 //    //console.log(html);
	 //    fs.write("salarypages/"+ year + "_" + category + ".html" , html, 'w');
	 //    _cb && _cb();

	 // Output Results Immediately

		window.setTimeout(function () {
	        var html = page.evaluate(function () {
	        	return document.getElementsByTagName('html')[0].innerHTML;
	    	});
	    	fs.write("salarypages/"+ year + "_" + category + ".htm", html, 'w');
	    	page = null;
	    	_cb && _cb();
	    }, 9000); // 9 Second Delay 
    


	};
}
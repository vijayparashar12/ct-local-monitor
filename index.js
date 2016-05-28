const env = process.env;
const config = require('./config');

var express = require('express');
var app = express();
var search = require('./search');


app.get('/search', function (req, res) {
    const product = "ttd";
    var out = {};
    for (var i = 0; i < config.cities.length; i++) {
        var city = config.cities[i];
        var count = 0;
        var startTime = new Date().getTime();
        //console.log(city);
        search(product, city, startTime, function (error, response, totalTime) {
            if (error != undefined) {
                console.log(error);
            } else {
                var result = JSON.parse(response);
                var cityData = {};
                out[result.city.name] = cityData;
                cityData["collections"] = result.collections.length;
                cityData["categories"] = result.categories.length;
                cityData["time"] = totalTime;
            }
            count++;
            if (config.cities.length == count) {
                console.log("Done!!")
                //console.log(out)
                res.statusCode = 200;
                res.json(out);
            }

        });

    }
});

app.get('/health', function (req, res) {
    res.writeHead(200);
    res.end();
});

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
    console.log('Example app listening on port 3000!');
});

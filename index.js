var express = require('express');
var app = express();
const http = require('http');
const config = require('./config');

app.get('/search', function (req, res) {
    const product = "ttd";
    var out = {};
    for (var i = 0; i < config.cities.length; i++) {
        var city = config.cities[i];
        var count = 0;
        var startTime = new Date().getTime();
        console.log(city);
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
                console.log(out)
                res.statusCode = 200;
                res.json(out);
            }

        });

    }
});

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
    console.log('Example app listening on port 3000!');
});

function search(product, city, startTime, callback) {
    var _path = '/local/api/v1/' + product + '/search?city=' + encodeURIComponent(city);
    var options = {
        hostname: 'www.cleartrip.com',
        port: 80,
        path: _path,
        method: 'GET',
        /*headers: {
            'Accept-Encoding': 'gzip, deflate, sdch'
        }*/
    }

    var req = http.request(options, (res) => {
        console.log('statusCode: ', res.statusCode);
        console.log('headers: ', res.headers);
        var data = '';
        res.on('data', (d) => {
            data = data + d;
        });
        res.on('end', () => {
            var totalTime = new Date().getTime() - startTime;
            console.log('No more data in response.');
            callback(null, data, totalTime);
        });
    });
    req.end();

    req.on('error', (e) => {
        callback(e);
    });
}
const env = process.env;
const config = require('./config');

var express = require('express');
var app = express();
var search = require('./search');

app.use('/map', express.static('html'));
app.get('/search', function (req, res) {
    var count = 0;
    var report = {};
    for (var p = 0; p < config.products.length; p++) {
        var product = config.products[p];
        var out = {};
        report[product] = out;
        for (var i = 0; i < config.cities.length; i++) {
            var city = config.cities[i].name;
            var startTime = new Date().getTime();
            //console.log(city);
            search(product, city, startTime, function (error, response, totalTime, product, city) {
                if (error != undefined) {
                    console.log(error);
                } else {
                    var result = JSON.parse(response);
                    var out = report[product];
                    var key = result.city == undefined ? city : result.city.name;
                    var cityData = {};

                    if (product != "fitness" && result.hasOwnProperty("collections") && result.collections != undefined
                        && result.collections != null) {
                        out[key] = cityData;
                        cityData["collections"] = result.collections.length;
                        cityData["categories"] = result.categories == null || result.categories == undefined ? 0 : result.categories.length;
                        var activityCount = 0;
                        if (product == "events") {
                            activityCount = result.events.length;
                        } else {
                            for (var k = 0; k < result.collections.length; k++) {
                                activityCount += result.collections[k].count;
                            }
                        }
                        cityData["activity_count"] = activityCount;
                    } else if (result.sub != undefined && result.sub != null && result.sub.length > 0) {
                        out[key] = cityData;
                        cityData["passes"] = result.sub == undefined ? 0 : result.sub.length;
                        cityData["gyms"] = result.fitGym == undefined ? 0 : result.fitGym.count;
                        cityData["categories"] = result.fitCat == undefined ? 0 : result.fitCat.count;
                    }
                    cityData["time"] = totalTime;
                    report[product] = out;
                }
                count++;
                if (config.products.length * config.cities.length == count) {
                    console.log("Done!!");
                    res.statusCode = 200;
                    res.json(report);
                }
            });

        }

    }
});

app.get('/health', function (req, res) {
    res.writeHead(200);
    res.end();
});

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
    console.log('app listening on port ' + env.NODE_PORT || 3000, env.NODE_IP);
});

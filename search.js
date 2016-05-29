const http = require('http');
const zlib = require('zlib');

function search(product, city, startTime, callback) {
    var _path = '/local/api/v1/' + product + '/search?city=' + encodeURIComponent(city);
    var options = {
        hostname: 'www.cleartrip.com',
        port: 80,
        path: _path,
        method: 'GET',
        headers: {
            'Accept-Encoding': 'gzip'
        }
    }

    var req = http.request(options, (res) => {
        console.log('statusCode: ', res.statusCode);
        // console.log('headers: ', res.headers);
        var data = '';
        var encoding = res.headers['content-encoding']
        if (encoding && encoding.indexOf('gzip') >= 0) {
            console.log("Gzip!!")
            var gunzip = zlib.createGunzip();
            res.pipe(gunzip);
            gunzip.on('data', function (d) {
                data = data + d.toString();
            }).on("end", function () {
                executeCallback(startTime, callback, data, product, city);
            }).on("error", function (e) {
                callback(e);
            });
        } else {
            res.on('data', (d) => {
                data = data + d;
            }).on('end', () => {
                executeCallback(startTime, callback, data, product, city);
            });
        }
    });
    req.end();

    req.on('error', (e) => {
        callback(e);
    });
}

function executeCallback(startTime, callback, data, product, city) {
    var totalTime = new Date().getTime() - startTime;
    console.log('No more data in response.');
    callback(null, data, totalTime, product, city);
}

module.exports = search;
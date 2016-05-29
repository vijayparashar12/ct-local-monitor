var cities = [
    {
        name: "bangalore",
        location: { lat: 12.9716, lng: 77.5946 }
    },
    {
        name: "mumbai",
        location: { lat: 19.076, lng: 72.8777 }
    },
    {
        name: "new delhi",
        location: { lat: 28.6139, lng: 77.2090 }
    },
    {
        name: "chennai",
        location: { lat: 13.0827, lng: 80.2707 }
    },
    {
        name: "hyderabad",
        location: { lat: 17.3850, lng: 78.4867 }
    },
    {
        name: "jaipur",
        location: { lat: 26.9124, lng: 75.7873 }
    },
    {
        name: "kolkata",
        location: { lat: 22.5726, lng: 88.3639 }
    },
    {
        name: "ahmedabad",
        location: { lat: 23.0225, lng: 72.5714 }
    },
    {
        name: "goa",
        location: { lat: 15.2993, lng: 74.1240 }
    },
    {
        name: "pune",
        location: { lat: 18.5204, lng: 73.8567 }
    },
    {
        name: "dubai",
        location: { lat: 25.2048, lng: 55.2708 }
    }
];

var products = [
    "ttd",
    "fnb",
    "events",
    "fitness"
];

function initMap() {
    var central = { lat: 23.2599, lng: 77.4126 }; //Bhopal's Lat lng
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: central
    });
    getApiData(function (apiData) {
        console.log("apidata");
        for (var i = 0; i < cities.length; i++) {
            var city = cities[i];
            var cityMarker = new google.maps.Marker({
                position: city.location,
                map: map,
                title: city.name
            });
            renderWindow(cityMarker, city, apiData);
        }
    });
}

function renderWindow(marker, city, apiData) {
    var contentString = '<div><p><b>' + capitalize(city.name) + '</b></p>';
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var productData = apiData[product];
        var data = productData[city.name];
        if (data != undefined) {
            var productData = '<ul> <b>' + product.toUpperCase() + '</b></br></br>';
            if (product != 'fitness') {
                productData +=
                    '<li> Collections : ' + data.collections + '</li>' +
                    '<li> Categories : ' + data.categories + '</li>' +
                    '<li> Total Activities : ' + data.activity_count + '</li>' +
                    '<li> Response Time : ' + data.time + '</li>';
            } else {
                productData +=
                    '<li> Passes : ' + data.passes + '</li>' +
                    '<li> Gyms : ' + data.gyms + '</li>' +
                    '<li> Categories : ' + data.categories + '</li>' +
                    '<li> Response Time : ' + data.time + '</li>';
            }
            productData += '</ul>';
            contentString += productData;
        }
    }
    contentString += '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
    });
    marker.addListener('click', function () {
        infowindow.open(marker.get('map'), this);
    });
}

function getApiData(callback) {
    $.get('/search', function (response) {
        console.log("got data");
        console.log(response);
        callback(response);
    });
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


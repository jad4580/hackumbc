var click1 = false;
var click2 = false;
var click3 = false;
var click4 = false;
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function highlight1(id) {
    if (click1 == true) {
        document.getElementById(id).style.backgroundColor = "white";
        map.data.forEach(function (feature) {
            // If you want, check here for some constraints.
            map.data.remove(feature);
        });
        click1 = false;
    } else {
        document.getElementById(id).style.backgroundColor = "lightblue";
        map.data.loadGeoJson('https://opendata.arcgis.com/datasets/4552d8a9271f41878319e89f612ac91a_259.geojson')
        click1 = true;
    }
}

function highlight2(id) {
    if (click2 == true) {
        document.getElementById(id).style.backgroundColor = "white";
        map.data.forEach(function (feature) {
            // If you want, check here for some constraints.
            map.data.remove(feature);
        });
        click2 = false;
    } else {
        document.getElementById(id).style.backgroundColor = "lightblue";
        map.data.loadGeoJson('https://opendata.arcgis.com/datasets/51cd2ffaea2e4579aace5a1d4f0de71f_0.geojson')
        click2 = true;
    }
}


function highlight3(id) {
    if (click3 == true) {
        document.getElementById(id).style.backgroundColor = "white";
        map.data.forEach(function (feature) {
            // If you want, check here for some constraints.
            map.data.remove(feature);
        });
        click3 = false;
    } else {
        document.getElementById(id).style.backgroundColor = "lightblue";
        map.data.loadGeoJson('https://opendata.arcgis.com/datasets/9f6e3610009842a6ba2ecf6292d69046_200.geojson')
        click3 = true;
    }
}

function highlight4(id) {
    if (click4 == true) {
        document.getElementById(id).style.backgroundColor = "white";
        map.data.forEach(function (feature) {
            // If you want, check here for some constraints.
            map.data.remove(feature);
        });
        click4 = false;
    } else {
        document.getElementById(id).style.backgroundColor = "lightblue";
        map.data.loadGeoJson('https://opendata.arcgis.com/datasets/2abfabb597c84189973ddb91ec7fc3c4_416.geojson')
        click4 = true;
    }
}


function addInfoWindow(marker, message) {

    var infoWindow = new google.maps.InfoWindow({
        content: message
    });


    google.maps.event.addListener(marker, 'click', function () {
        if (infoWindow.opened == true) {
            infoWindow.close();
        } else {
            infoWindow.open(map, marker);
        }
        infoWindow.opened = !infoWindow.opened;
    });
}

var map;

function initMap() {
    google.maps.InfoWindow.prototype.opened = false;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.2582, lng: -76.7131},
        zoom: 13,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        fullscreenControl: false
    });

    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);

    // const userAction = async () => {
    //     const response = await fetch('http://localhost:3000/markets');
    //     const myJson = await response.json(); //extract JSON from the http response
    //
    //     var features = myJson.features;
    //     //console.log(features);
    //     for (var i = 0; i < features.length; i++) {
    //         var properties = features[i].properties;
    //         var geometry = features[i].geometry;
    //
    //         var contentString =
    //             '<div id="bodyContent">' +
    //             '<b>' + properties.Name + '</b>' +
    //             '</div>';
    //
    //         var marker = new google.maps.Marker({
    //             position: {lat: geometry.coordinates[1], lng: geometry.coordinates[0]},
    //             map: map,
    //             title: properties.Name,
    //         });
    //         addInfoWindow(marker, contentString);
    //         marker.setVisible(true);
    //     }
    //     // do something with myJson
    // };
    //
    // userAction();

    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29),
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindowContent.children['place-icon'].src = place.icon;
        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent = address;
        infowindow.open(map, marker);
    });
}

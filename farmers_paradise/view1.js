// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

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

function initMap() {
    google.maps.InfoWindow.prototype.opened = false;
    var map = new google.maps.Map(document.getElementById('map'), {
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
    var input = document.getElementById('pac-input');

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

    const userAction = async () => {
        const response = await fetch('http://localhost:3000/markets');
        const myJson = await response.json(); //extract JSON from the http response


        var features = myJson.features;
        // console.log(features);
        for (var i = 0; i < features.length; i++) {
            var properties = features[i].properties;
            var geometry = features[i].geometry;

            var contentString =
                '<div id="bodyContent">' +
                '<b>' + properties.Name + '</b>' +
                '</div>';

            // var market_html = '<div class="items-body-content">' +
            //     '<span>' + properties.Name + '</span>' +
            //     '<i class="fa fa-angle-right"></i>' +
            //     '</div>';
            // document.getElementById('items-body').innerHTML += market_html;

            var marker = new google.maps.Marker({
                position: {lat: geometry.coordinates[1], lng: geometry.coordinates[0]},
                map: map,
                title: properties.Name,
            });
            addInfoWindow(marker, contentString);
            marker.setVisible(true);
        }
        // do something with myJson
    };

    userAction();

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

        var service = new google.maps.DistanceMatrixService;

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
            var changed_lat = place.geometry.location.lat();
            var changed_lng = place.geometry.location.lng();

            const userAction = async (day) => {
                const response = await fetch('http://localhost:3000/markets');
                const myJson = await response.json(); //extract JSON from the http response
                // console.log(myJson);
                while (document.getElementById('items-body').firstChild) document.getElementById('items-body').removeChild(document.getElementById('items-body').firstChild);

                var features = myJson.features;
                // console.log(features);
                for (var i = 0; i < features.length; i++) {
                    if(day == "All" || features[i].properties.Day == day) {
                        var geometry = features[i].geometry;
                        var lat = geometry.coordinates[1];
                        var lng = geometry.coordinates[0];

                        var origin = new google.maps.LatLng(changed_lat, changed_lng);
                        var dest = new google.maps.LatLng(lat, lng);

                        GoogleMapDistance(origin, dest, features[i]);
                    }
                }
            };

            function GoogleMapDistance(YourLatLong, DestLatLong, item) {
                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix(
                    {
                        origins: [YourLatLong],
                        destinations: [DestLatLong],
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.IMPERIAL,
                        avoidHighways: false,
                        avoidTolls: false
                    }, function (response, status) {
                        callback(response, status, item)
                    });
            }

            function callback(response, status, item) {
                console.log(response);
                if (status == 'OK') {
                    // console.log(response);
                    if (response.rows[0].elements[0].duration.value < 1800) {
                        var market_html = '<div class="items-body-content" onclick=style="display: inline-block;">' +
                            '<a href=\"' + item.properties.Website + '\"><span>' + item.properties.Name  + '<br /></span></a>' +
                            '<span style=\"float: right\">' + response.rows[0].elements[0].duration.text + '</span>' +
                            '<span>' + item.properties.Address + ", " + item.properties.City + ', ' + item.properties.State + ' ' + item.properties.Zip_Code + '<br /></span>' +
                            '<span class="tooltiptext">' + item.properties.Day + ", " + item.properties.Market_hou + '</span>' +
                            '<i class="fa fa-angle-right"></i>' +
                            '</div>';
                        document.getElementById('items-body').innerHTML += market_html;
                    }
                }
            }

            userAction(document.querySelector('input[name="date"]:checked').value);
            document.getElementById('container').style.visibility = "visible";

            // https://maps.googleapis.com/maps/api/distancematrix/json?origins=39.2520211,-76.7071216&destinations=39.32806999998833,-76.6109829997113&mode=driving&language=en-EN&sensor=false&key=AIzaSyBt8S9YJAPUvemh9KHONF_puV1lBja9qkA
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        function zoomToPoint(location) {
            marker.setPosition(place.geometry.location);
        }

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

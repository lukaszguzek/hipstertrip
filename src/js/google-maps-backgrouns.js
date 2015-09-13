window.onload = function () {
    var coordinates = {lat: 52.230415, lng: 20.997336},
    map = new google.maps.LatLng(coordinates.lat, coordinates.lng),
    mapOptions = {
        zoom: 16,
        streetViewControl: false,
        scaleControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: map
    },
    mapContainer = document.getElementsByClassName('google-map')[0],
    backgroundMap = new google.maps.Map(mapContainer, mapOptions);
};

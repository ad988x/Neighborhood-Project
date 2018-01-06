var map;
var markers = [];
var contentString = ''


var restaurants = [
    {title: 'Zias Restaurant & Catering', location: {lat: 38.615733, lng: -90.274971}},
    {title: 'Charlie Gittos On the Hill', location: {lat: 38.617968, lng: -90.273455}},
    {title: 'Gioias Deli', location: {lat: 38.617385, lng: -90.276820}},
    {title: 'Mama Toscanos Ravoli', location: {lat: 38.614968, lng: -90.277693}},
    {title: 'Rigazzis', location: {lat: 38.616569, lng: -90.268521}},
    {title: 'Milos Tavern', location: {lat: 38.615865, lng: -90.273049}}
  ];

function restaurantData(data) {
    this.title = data.title;
    this.restaurants = data.restaurants;
}

  function initMap() {
    // Create a styles array to use with the map.
    var styles = [
      {
        featureType: 'water',
        stylers: [
          { color: '#19a0d8' }
        ]
      },{
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
          { color: '#ffffff' },
          { weight: 6 }
        ]
      },{
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
          { color: '#e85113' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          { color: '#efe9e4' },
          { lightness: -40 }
        ]
      },{
        featureType: 'transit.station',
        stylers: [
          { weight: 9 },
          { hue: '#e85113' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [
          { visibility: 'off' }
        ]
      },{
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          { lightness: 100 }
        ]
      },{
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          { lightness: -100 }
        ]
      },{
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          { visibility: 'on' },
          { color: '#f0e4d3' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          { color: '#efe9e4' },
          { lightness: -25 }
        ]
      }
    ];
    // Creating a new map for Italian Restaurants in South St. louis Hills
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.616192, lng: -90.277265},
      zoom: 17,
      styles: styles,
      mapTypeControl: false
    });


    var largeInfowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('1B965E');

    var highlightedIcon = makeMarkerIcon('FFFF24');
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < restaurants.length; i++) {
    // Get the position from the location array.
    var position = restaurants[i].location;
    var title = restaurants[i].title;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });

    restaurants[i].marker = marker;

    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
      for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(google.maps.Animation.NULL);
      }
      this.setAnimation(google.maps.Animation.BOUNCE);
    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }

  //  Foursquare Info

    var clientID = '2YV0OH4UNUF3V5HYRPHGFF2U0ZF4DUIQ0L34SX4M1ZZMCHXN',
    var clientSecret = 'LBPWRT5C3W5J3EET5MKUFIGGPW53D0UNRV1YS4XN30QJBX40',
    $.ajax({
            type: "GET",
            dataType: 'json',
            cache: false,
            url: 'https://api.foursquare.com/v2/venues/' + restaurants.name + CLIENT_ID_Foursquare + CLIENT_SECRET_Foursquare + '&v=20130815',
            async: true,
            success: function(data) {
                console.log(data.response);
              }
      });

function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div><div><a href=' + marker.title + '> Foursquare Information </a></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);}


function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

var myModel = function() {
  var self = this;

  this.markers = markers;

  this.restaurantsList = ko.observableArray([]);

  this.filterInput = ko.observable();

  self.filter = function(title) {
    self.filterInput(title);
  }

  this.currentRes = ko.observable(self.restaurantsList()[0]);

  this.selectRes = function(clickRes) {
    self.currentRes(clickRes);
    this.markers = markers;
    for (var i = 0; i < this.markers.length; i++) {
      var currentMarker = this.markers[i];
      if (currentMarker.title == clickRes.title) {
        google.maps.event.trigger(this.markers[i], 'click');
      }
    };
  }

  restaurants.forEach(function(restaurantItem) {
    self.restaurantsList.push(new restaurantData(restaurantItem));
  });

  //ko computed to filter location list on text input
  self.filterrestaurants = ko.computed(function() {
    if (!self.filterInput()) {
      for (i = 0; i < this.markers.length; i++) {
        this.markers[i].setVisible(true);
      };
      return self.restaurantsList();
    } else {
      var updatedMarkers = [];
      for (var i = 0; i < this.markers.length; i++) {
        var currentMarker = this.markers[i];
        if (currentMarker.title.toLowerCase().includes(self.filterInput().toLowerCase())) {
          updatedMarkers.push(currentMarker);
          this.markers[i].setVisible(true);
        } else {
          this.markers[i].setVisible(false);
        }
      }
      return ko.utils.arrayFilter(self.restaurantsList(), function(rests) {
        return rests.title.toLowerCase().includes(self.filterInput().toLowerCase());
      })
    }
  }, this);
}

ko.applyBindings(new myModel());

function errorHandling() {
  alert("Google Maps has failed to load.");
}

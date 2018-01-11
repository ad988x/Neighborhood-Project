var map;

var markers = [];

var contentString = '';

var attractions = [
    {title: 'Gateway Arch', location: {lat: 38.624691, lng: -90.184776}, img: 'pics/Arch.jpg'},
    {title: 'Old Courthouse (St. Louis)', location: {lat: 38.625674, lng: -90.189274}, img: 'pics/Courthouse.jpg'},
    {title: 'Lumière Place Casino & Hotels', location: {lat: 38.633392, lng: -90.184488}, img: 'pics/Lumiere_Place.jpg'},
    {title: 'St. Louis Ballpark Village', location: {lat: 38.623904, lng: -90.191913}, img: 'pics/BP_Village.jpg'},
    {title: 'St. Louis City Museum', location: {lat: 38.633636, lng: -90.200551}, img: 'pics/City_Museum.jpg'}
  ];

function attractionData(data) {
    this.title = data.title;
    this.attractions = data.attractions;
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
    // Creating a new map for St. Louis Attractions I enjoy
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.628344, lng: -90.194970},
      zoom: 16,
      styles: styles,
      mapTypeControl: false
    });


  var largeInfowindow = new google.maps.InfoWindow();


  var bounds = new google.maps.LatLngBounds();
    // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('1B965E');

  var highlightedIcon = makeMarkerIcon('FFFF24');
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < attractions.length; i++) {
    // Get the position from the location array.
    var position = attractions[i].location;
    var title = attractions[i].title;
    var img = attractions[i].img;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      img: img,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i});

    markers.push(marker);

    marker.addListener('click', openInfoWindow);
    marker.addListener('mouseover', mouseOver);
    marker.addListener('mouseout', mouseOut);
  }
  function openInfoWindow() {
    populateInfoWindow(this, largeInfowindow);
    for (var i = 0; i < markers.length; i++) {
      markers[i].setAnimation(google.maps.Animation.NULL);
      }
    this.setAnimation(google.maps.Animation.BOUNCE);
    }

  function mouseOver() {
    this.setIcon(highlightedIcon);
    }
  function mouseOut() {
      this.setIcon(defaultIcon);
    }
    for (var m = 0; m < markers.length; m++) {
      markers[m].setMap(map);
      bounds.extend(markers[m].position);
    }

    google.maps.event.addDomListener(window, 'resize', function() {
      map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
    });
}

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

//followed discussion.udacity.com to complete the picture aspect of this wikipedia api.
function populateInfoWindow(marker, infowindow) {
        if (infowindow.marker != marker) {
          infowindow.setContent('');
          infowindow.marker = marker;
          infowindow.addListener('closeclick', function() {
            setTimeout(function() {
                        marker.setAnimation(null);
                      }, 3000);
            infowindow.marker = null;
          });
        var wikiSite = '';
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title  + '&format=json&callback=wikiCallback';
		    //var wikiRequestTimeout =
    		//var contentString = '<h3>' + marker.title + '</h3>' + '<img src="' + marker.img + '" height=\"100px\" width=\"200px\">' + '<br>';
    		$.ajax({
    			url: wikiUrl,
    			dataType: "jsonp",
    			//jsonp : "callback",
		    	success: function(response) {//response is a javascript object
		    		var articleList = response[1];

		    		for(i = 0; i < articleList.length; i++) {
		    			articleStr = articleList[i];
		    			var url = 'http://en.wikipedia.org/wiki/' + articleStr;
              wikiSite = url;
		    			//contentString = contentString + '<a href=\"' + url + '\">' + url + '</a>' + '<br>';
		    		}
		    		//clearTimeout(wikiRequestTimeout);
            //clearTimeout(wikiRequestTimeout);
            infowindow.setContent('<h3>' + marker.title + '</h3>' + '<img src="' + marker.img + '" height=\"100px\" width=\"200px\">' + '<br>' + '<a href=\"' + wikiSite + '\">' + "Click Here for Wikipedia Information" + '</a>');
            setTimeout(function(){
    		    	infowindow.setContent("failed to get wikipedia page for more information");
    		    }, 10000);
          }
          		});

          infowindow.open(map, marker);
        	}
    	}


var MyModel = function() {
  var self = this;

  this.markers = markers;

  this.attractionsList = ko.observableArray([]);

  this.filterInput = ko.observable();

  self.filter = function(title) {
    self.filterInput(title);
  };

  this.currentRes = ko.observable(self.attractionsList()[0]);

  this.selectAtr = function(clickRes) {
    self.currentRes(clickRes);
    this.markers = markers;
    for (var i = 0; i < this.markers.length; i++) {
      var currentMarker = this.markers[i];
      if (currentMarker.title == clickRes.title) {
        google.maps.event.trigger(this.markers[i], 'click');
      }
    }
  };

  attractions.forEach(function(attractionItem) {
    self.attractionsList.push(new attractionData(attractionItem));
  });

  //ko computed to filter location list on text input
  self.filterattractions = ko.computed(function() {
    if (!self.filterInput()) {
      for (r = 0; r < this.markers.length; r++) {
        this.markers[r].setVisible(true);
      }
      return self.attractionsList();
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
      return ko.utils.arrayFilter(self.attractionsList(), function(rests) {
        return rests.title.toLowerCase().includes(self.filterInput().toLowerCase());
      });
    }
  }, this);
};

ko.applyBindings(new MyModel());

function errorHandling() {
  alert("Google Maps has failed to load.");
}

var app = {
    // Application Constructor
    initialize: function() {
		this.initializeMap();
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
		var self = this;
        app.receivedEvent('deviceready');
        $("#track-me").click(function(){
			app.trackMe();
			//app.playBeep(1);
			app.vibrate(100);
		});
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    },
    trackMe: function(){
		navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError,{
			enableHighAccuracy: true,
			timeout : 1000
		});
	},
	geoSuccess: function(position){
		$("p.received").html("Tracking...");
		var location = 'Latitude: ' + position.coords.latitude + '<br />' +
                       'Longitude: ' + position.coords.longitude + '<br />' +
                       'Altitude: ' + position.coords.altitude + '<br />' +
                       'Accuracy: ' + position.coords.accuracy + '<br />' +
                       'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
                       'Heading: ' + position.coords.heading + '<br />' +
                       'Speed: ' + position.coords.speed + '<br />' +
                       'Timestamp: ' + new Date(position.timestamp) + '<br />';
		//$(".location-data").html(location);
		//app.fetchAddress(position);
		app.locateOnMap(position);
		console.log("located on map");
	},
	fetchAddress: function(position){
		$.ajax({
			url  : 'https://maps.googleapis.com/maps/api/geocode/json',
			data : {
				sensor: false,
				latlng: position.coords.latitude+","+position.coords.longitude,
				key: 'AIzaSyA2ZM5moOcYeEEp808wO818WUWVqG3PmBU'
			},
			dataType: "json",
			success : function(data) {
				var results = data.results;
				var addresses = "";
				$.each(results,function(key,val){
					addresses += val.formatted_address+"<br />";	
				});
				$(".location-addresses").html(addresses);
			}
		});
	},
	geoError: function(error){
		console.log(error.code);
		app.trackMe();
	},
	playBeep: function(times) {
        navigator.notification.beep(times);
    },
    vibrate: function(interval) {
        navigator.notification.vibrate(interval);
    },
    locateOnMap: function(position){
		var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		if( typeof marker != 'undefined' ){
			marker.setMap(null);
		}
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
			map: gmap,
			title: "You",
			animation: google.maps.Animation.DROP
		});
		//var bounds = new google.maps.LatLngBounds();
		//bounds.extend(clientPosition);
		//gmap.fitBounds(bounds);
		gmap.setZoom(15);
		gmap.setCenter(marker.getPosition());
	},
	initializeMap: function() {
		var mapOptions = {
			center: new google.maps.LatLng(21.1289956,82.7792201),
			zoom: 3,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		};
		gmap = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	}

};

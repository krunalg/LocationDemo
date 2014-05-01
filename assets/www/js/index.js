var app = {
    // Application Constructor
    initialize: function() {
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
        app.receivedEvent('deviceready');
        $("#track-me").click(function(){
			app.trackMe();
			//app.playBeep(1);
			app.vibrate(500);
		});
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    trackMe: function(){
		navigator.geolocation.watchPosition(this.geoSuccess, this.geoError,{
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
		$(".location-data").html(location);
		app.fetchAddress(position);
	},
	fetchAddress: function(position){
		console.log("here fetched address");
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
		console.log(error);
	},
	playBeep: function(times) {
        navigator.notification.beep(times);
    },
    vibrate: function(interval) {
        navigator.notification.vibrate(interval);
    }

};

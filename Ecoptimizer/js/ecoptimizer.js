var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;


/*
Data
Based on env rating data from Camden council/Travelfootprint.org/ Clear Zone Partnership
CAR
WALKING
CYCLING
Possible Types for TRANSIT
VehicleType.RAIL 	Rail.
VehicleType.METRO_RAIL 	Light rail transit.
VehicleType.SUBWAY 	Underground light rail.
VehicleType.TRAM 	Above ground light rail.
VehicleType.MONORAIL 	Monorail.
VehicleType.HEAVY_RAIL 	Heavy rail.
VehicleType.COMMUTER_TRAIN 	Commuter rail.
VehicleType.HIGH_SPEED_TRAIN 	High speed train.
VehicleType.BUS 	Bus.
VehicleType.INTERCITY_BUS 	Intercity bus.
VehicleType.TROLLEYBUS 	Trolleybus.
VehicleType.SHARE_TAXI 	Share taxi is a kind of bus with the ability to drop off and pick up passengers anywhere on its route.
VehicleType.FERRY 	Ferry.
VehicleType.CABLE_CAR 	A vehicle that operates on a cable, usually on the ground. Aerial cable cars may be of the type VehicleType.GONDOLA_LIFT.
VehicleType.GONDOLA_LIFT 	An aerial cable car.
VehicleType.FUNICULAR 	A vehicle that is pulled up a steep incline by a cable. A Funicular typically consists of two cars, with each car acting as a counterweight for the other.
VehicleType.OTHER 	All other vehicles will return this type.
*/
var defaultEcoCost = 10;
var ecoCosts = {
	WALKING: { name: 'Walking', cost: 5.41 }, /* ID 1 */
	BICYCLING: { name: 'Bicycling', cost: 4.39 }, /* ID 3 */
	DRIVING: { name: 'Driving', cost: 30.30 }, /* ID 201 */
	TRANSIT_HEAVY_RAIL: { name: 'Heavy Rail', cost: 5.53 }, /* ID 93  (electric)*/
	TRANSIT_RAIL: { name: 'Rail', cost: 8.29 }, /* ID 87 (diesel)*/
	TRANSIT_SUBWAY: { name: 'Subway', cost: 12.36 }, /* ID 100  (electric)*/
	TRANSIT_TRAM: { name: 'Tram', cost: 12.36 }, /* ID 100  (electric)*/
	TRANSIT_MONORAIL: { name: 'Monorail', cost: 5.53 }, /* ID 93 (electric)*/
	TRANSIT_COMMUTERTRAIN: { name: 'Communter Train', cost: 21.57 }, /* ID 84 (diesel) */
	TRANSIT_HIGH_SPEED_TRAIN: { name: 'High Speed Train', cost: 6.35 }, /* ID 93 * ~ 31/27 (based on source 3 pag 35) (electric)*/
	TRANSIT_BUS: { name: 'Bus', cost: 15.11 }, /* ID 23 (from 2006)*/
	TRANSIT_INTERCITYBUS: { name: 'Intercity Bus', cost: 10.46 }, /* ID 31 (from 2006)*/
	TRANSIT_TROLLEYBUS: { name: 'Trolleybus', cost: 10.58 }, /* ID 23 * ~ 0.7 (based on source 4 pag 101)*/
	TRANSIT_SHARE_TAXI: { name: 'Share Taxi', cost: 15.23 }, /* ID 66 (from 2006)*/
	TRANSIT_FERRY: { name: 'Ferry', cost: defaultEcoCost * 0.5 }, /* No DATA (educated guess) */
	TRANSIT_CARFERRY: { name: 'Car Ferry', cost: defaultEcoCost * 0.8 }, /* No DATA (educated guess) */
	TRANSIT_CABLE_CAR: { name: 'Cable Car', cost: defaultEcoCost * 0.8 }, /* No DATA (educated guess) */
	TRANSIT_GONDOLA_LIFT: { name: 'Gondola Lift', cost: defaultEcoCost * 0.8 }, /* No DATA (educated guess) */
	TRANSIT_FUNICULAR: { name: 'Funicular', cost: defaultEcoCost * 0.4 }, /* No DATA (educated guess) */
	TRANSIT_OTHER: { name: 'Other', cost: defaultEcoCost }, /* No DATA */
};

var transportModeResolver = {
	trein: 'TRANSIT_RAIL',
	train: 'TRANSIT_RAIL',
};

function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	var delft = new google.maps.LatLng(51.998848, 4.373527);
	var mapOptions = {
		center: delft,
		zoom: 7
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("route"));
	google.maps.event.addListener(directionsDisplay, 'routeindex_changed',
    function () {
    	var totalDist = 0;
    	var totalImpact = 0;
    	var index = directionsDisplay.getRouteIndex();
    	var route = directionsDisplay.directions.routes[index];
    	var ecoResults = CalculateEcoCosts(route);
    	$('#ecocosts').empty();
    	for (transportMode in ecoResults) {
    		var data = ecoResults[transportMode];
    		d = document.createElement('div');
    		var modeName = 'Other';
    		if (typeof ecoCosts[transportMode].name != 'undefined') {
    			modeName = ecoCosts[transportMode].name;
    		}
    		totalDist += data.distance / 1000;
    		totalImpact += data.costs;
    		var html = [];
    		html.push('<div class="transport-mode-name">',
				modeName,
				'</div><div class="transport-mode-distance">Distance: ',
				(data.distance / 1000).toFixed(2),
				'km </div><div class="transport-mode-ecoimpact">Eco Impact: ',
				data.costs.toFixed(2),
				'pt</div><div class="transport-mode-ecoimpactperkm">Impact per Distance: ',
				(data.costs / (data.distance / 1000)).toFixed(2),
				'pt</div>')
    		$(d).addClass('transport-mode')
				.html(html.join(''))
				.appendTo($("#ecocosts"));
    	}
    	var html = [];
    	html.push(
			'<div class="transport-mode-total-distance">Total Distance: ',
			totalDist.toFixed(2),
			'km </div><div class="transport-mode-total-ecoimpact">Total Eco Impact: ',
			totalImpact.toFixed(2),
			'pt</div><div class="transport-mode-total-ecoimpactperkm">Total Impact per Distance: ',
				(totalImpact / totalDist).toFixed(2),
				'pt</div>')
    	d_totals = document.createElement('div');
    	$(d_totals).addClass('transport-mode-total')
			.html(html.join(''))
			.appendTo($("#ecocosts"));
    	//console.log(ecoResults);
    });

}
google.maps.event.addDomListener(window, 'load', initialize);

function calcRoute() {
	var start = document.getElementById("start").value;
	var end = document.getElementById("end").value;
	var selectedMode = $('#travelModeButtons label.active input').val()
	var request = {
		origin: start,
		destination: end,
		provideRouteAlternatives: true,
		unitSystem: google.maps.UnitSystem.METRIC,
		travelMode: google.maps.TravelMode[selectedMode],
		transitOptions: {
			routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
		},
	};
	directionsService.route(request, function (result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
			//displayRouteInSidebar(result);
			hideError();
		} else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
			setError('No Results!');
			showError();
		} else {
			setError(status);
			showError();
		}
	});
}
function CalculateEcoCosts(curr_route) {
	var totals = [];
	for (leg = 0, len_legs = curr_route.legs.length; leg < len_legs; ++leg) {
		var curr_leg = curr_route.legs[leg];
		for (step = 0, len_steps = curr_leg.steps.length; step < len_steps; ++step) {
			var curr_step = curr_leg.steps[step];
			var index = 'OTHER';
			if (typeof curr_step.transit != 'undefined' && curr_step.travel_mode == 'TRANSIT') {
				if (typeof curr_step.transit.line.vehicle.type != 'undefined') {
					index = 'TRANSIT_' + curr_step.transit.line.vehicle.type;
				} else {
					if (typeof curr_step.transit.line.vehicle.name != 'undefined') {
						for (search in transportModeResolver) {
							if (curr_step.transit.line.vehicle.name.toLowerCase().indexOf(search) != -1) {
								index = transportModeResolver[search];
								break;
							}
						}
					}
					if (index == 'OTHER') {
						index = 'TRANSIT_OTHER';
					}

				}
			} else {
				if (curr_step.maneuver == 'ferry') {
					if (curr_step.travel_mode == 'DRIVING') {
						index = 'TRANSIT_CARFERRY';
					} else {
						index = 'TRANSIT_FERRY';
					}
				} else if (curr_step.maneuver == 'ferry-train') {
					index = 'TRANSIT_HEAVY_RAIL';
				} else {
					index = curr_step.travel_mode;
				}
			}

			if (typeof totals[index] != 'undefined') {
				totals[index] += curr_step.distance.value;
			} else {
				totals[index] = curr_step.distance.value;
			}
		}
	}
	var result_obj = {};
	for (key in totals) {
		if (typeof ecoCosts[key] != 'undefined') {
			result_obj[key] = { costs: ecoCosts[key].cost * totals[key] / 1000, distance: totals[key] };
		} else {
			result_obj[key] = { costs: defaultEcoCost * totals[key] / 1000, distance: totals[key] };
		}
	}
	//console.log(result_obj);
	return result_obj;
}

$(function () {
	updateContentHeight();
	$('#sidebar-content').enscroll({
		showOnHover: false,
		verticalTrackClass: 'track3',
		verticalHandleClass: 'handle3'
	});
	$('#sidebar-content').css('width', '');
	/*$('.method').click(function (){
		var id = parseInt($(this).data('id'));
		console.log('Select ID: '+id);
	});	*/
	$('#calculate').click(function () {
		calcRoute();
	});

	$(window).resize(function () {
		updateContentHeight();
	});
});

function updateContentHeight() {
	var height = 20 + $('#sidebar-footer').height() + $('#sidebar-header').height();
	$('#sidebar-content').css('height', 'calc(100% - ' + height + 'px)');
	//console.log(height);
}

function setError(str) {
	$('#error').html(str);
}

function showError() {
	$('.route-error').removeClass('hidden');
}

function hideError() {
	$('.route-error').addClass('hidden');
}

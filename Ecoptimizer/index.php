<?php
//config
$lat = 51.998848;
$lng = 4.373527;
?>
<!DOCTYPE html>
<html>
<head>
	<title>Ecoptimizer by Erwin de Haan</title>
	<meta charset="utf-8">
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	<script src="//enscrollplugin.com/releases/enscroll-0.6.1.min.js"></script>
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">

	<!-- Optional theme -->
	<!--<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css">-->

	<!-- Latest compiled and minified JavaScript -->
	<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?key=AIzaSyCA62Eu6HuFQcD05SZDXT7xd8VFHb4NjGw"></script>

	<link rel="stylesheet" href="css/main.css" />
	<script type="text/javascript" src="js/ecoptimizer.js"></script>
</head>
<body>
	<div class="container-fluid fill">
		<div class="row fill">
			<div id="map-canvas" class="col-lg-10 col-md-8 col-sm-6"></div>
			<div id="sidebar-header" class="col-lg-2 col-md-4 col-sm-6">
				<h1>Ecoptimizer</h1>
				<p>
					Select your mode of transport and pick a start and end point.
				</p>
				<div class="col-xs-12">
					<form class="form-horizontal">
						<div class="form-group">
							<div class="col-xs-12">
								<div class="btn-group btn-group-sm" data-toggle="buttons" id="travelModeButtons">
									<label class="btn btn-default active">
										<input type="radio" name="travelMode" id="travelMode_DRIVING" value="DRIVING"/>
										<div class="directions-travel-mode-icon directions-drive-icon" title="Driving" aria-label="Driving"></div>
									</label>
									<label class="btn btn-default">
										<input type="radio" name="travelMode" id="travelMode_TRANSIT" value="TRANSIT" />
										<div class="directions-travel-mode-icon directions-transit-icon" title="Transit" aria-label="Transit"></div>
									</label>
                                    <label class="btn btn-default">
										<input type="radio" name="travelMode" id="travelMode_WALKING" value="WALKING" />
										<div class="directions-travel-mode-icon directions-walk-icon" title="Walking" aria-label="Walking"></div>
									</label>
                                    <label class="btn btn-default">
										<input type="radio" name="travelMode" id="travelMode_BICYCLING" value="BICYCLING" />
										<div class="directions-travel-mode-icon directions-bicycle-icon" title="Bicycling" aria-label="Bicycling"></div>
									</label>
								</div>
							</div>
						</div>
						<div class="form-group">
							<div class="col-xs-12">
								<input type="text" class="form-control" name="start" id="start" placeholder="Choose starting point." required="required">
							</div>
						</div>
						<div class="form-group">
							<div class="col-xs-12">
								<input type="text" class="form-control" name="end" id="end" placeholder="Choose end point." required="required">
							</div>
						</div>
						<div class="form-group">
							<div class="col-xs-12">
								<button class="btn btn-primary pull-right" name="calculate" id="calculate" type="button">Calculate</button>
                                <div class="route-error hidden"><small id="error">Error</small></div>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div id="sidebar-content" class="col-lg-2 col-md-4 col-sm-6">
				<div class="col-xs-12" id="ecocosts">

				</div>
				<div class="col-xs-12" id="route">
				</div>
			</div>
			<div id="sidebar-footer" class="col-lg-2 col-md-4 col-sm-6">
					<!--<form class="form-horizontal">
						<div class="form-group">
							<button type="submit" class="btn btn-default col-xs-12">Continue</button>
						</div>
					</form>-->
					<p class="muted credit"><small>&copy 2015 Erwin de Haan. All rights reserved. Using data from Camden council/Travelfootprint.org/Clear Zone Partnership. 
                        Points are overall TFP env rating based on <a href="https://docs.google.com/spreadsheet/ccc?key=0Agol553XfuDZdHlWSmRRckpXZWdSczdoVVBjbHU2dHc&hl=en_GB#gid=0" target="_blank">this</a>.</small></p>				
			</div>
		</div>
	</div>
</body>
</html>

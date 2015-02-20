<?php
function mt_randf($min, $max)
{
    return $min + abs($max - $min) * mt_rand(0, mt_getrandmax())/mt_getrandmax();
}
//config
$nummarkers = 20;
$kinds = array('TD','Store','Warehouse');
$lat = 51.998848;
$lng = 4.373527;
$maxdist = 0.05;
$markers = array();
for($i = 0; $i<$nummarkers; $i++){
	$markers[] = array('id'=>$i,
	'kind'=>mt_rand(0, count($kinds)-1),
	'impact'=>mt_rand(0, 100),
	'lat'=>mt_randf($lat-$maxdist,$lat+$maxdist),
	'lng'=>mt_randf($lng-$maxdist,$lng+$maxdist));	
}
?>
<!DOCTYPE html>
<html>
  <head>
    
    <meta charset="utf-8">    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
   	<script src="//enscrollplugin.com/releases/enscroll-0.6.1.min.js"></script>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
    
    <!-- Optional theme -->
    <!--link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css">-->
    
    <!-- Latest compiled and minified JavaScript -->
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
    
    <style type="text/css">
     html, body, #map-canvas { height: 100%; margin: 0; padding: 0;}

	.fill { 
		min-height: 100%;
		height: 100%;
	}	
	#sidebar-header {
		height: 120px;	
		margin-bottom: 10px
	}
	#sidebar-footer {
		margin-top: 10px;
		height: 50px;
		vertical-align: bottom;	
	}
	#sidebar-content{
		overflow:auto;
		height: calc(100% - 190px);	/* full height minus header and footer size. */
		padding: 0 5px;	
	}
	.track3 {
		width: 10px;
		background: rgba(0, 0, 0, 0);
		margin-right: 2px;
		border-radius: 10px;
		-webkit-transition: background 250ms linear;
		transition: background 250ms linear;
	}
	
	.track3:hover,
	.track3.dragging {
		background: #d9d9d9; 
		background: rgba(0, 0, 0, 0.15);
	}
	
	.handle3 {
		width: 7px;
		right: 0;
		background: #999;
		background: rgba(0, 0, 0, 0.4);
		border-radius: 7px;
		-webkit-transition: width 250ms;
		transition: width 250ms;
	}
	
	.track3:hover .handle3,
	.track3.dragging .handle3 {
		width: 10px;
	}
	.method{
		border: 1px lightgrey solid;	
		height: 75px;
		margin-top: 2px;
		margin-bottom: 2px;
	}
	.method:hover{
		background-color: lightgray;
	}
    </style>
    <script type="text/javascript"
      src="//maps.googleapis.com/maps/api/js?key=AIzaSyCA62Eu6HuFQcD05SZDXT7xd8VFHb4NjGw">
    </script>
    <script type="text/javascript">
      function initialize() {
        var mapOptions = {
          center: { lat: <?=$lat?>, lng: <?=$lng?>}, /* Replace with location of owners address*/
          zoom: 14 /* Needs to depend on closest TD */
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
			
		<?php 
		foreach($markers as $marker){
			?>
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(<?=$marker['lat']?>,<?=$marker['lng']?>),
				map: map,
				title:'<?=$marker['id'].' '.$kinds[$marker['kind']]?>'
			});
			<?php
		}
		?> 
      }
      google.maps.event.addDomListener(window, 'load', initialize);
    </script>
    <script type="text/javascript">	
		$(function(){	
			$('#sidebar-content').enscroll({
				showOnHover: false,
				verticalTrackClass: 'track3',
				verticalHandleClass: 'handle3'
			});
			$('#sidebar-content').css('width','');
			$('.method').click(function (){
				var id = parseInt($(this).data('id'));
				console.log('Select ID: '+id);
			});			
		});	
		function setActive(){
			
		}
	</script>
  </head>
  <body>
  	<div class="container-fluid fill"> 
        <div class="row fill">
            <div id="map-canvas" class="col-lg-10 col-md-8 col-sm-6"></div>            
            <div id="sidebar-header" class="col-lg-2 col-md-4 col-sm-6">
                <h1>Ecoptimizer</h1>
                <p>
                Select the way you want to get your order.
                </p>
            </div>
            <div id="sidebar-content" class="col-lg-2 col-md-4 col-sm-6">                    
                <div class="method-container col-xs-12">
                    <?php 
					foreach($markers as $marker){
						?>
						<div class="method" data-id="<?=$marker['id']?>">
							<div class="col-md-2">
							<?=$marker['id']?>
							</div>
							<div class="col-md-4">
							<?=$kinds[$marker['kind']]?>
							</div>
							<div class="col-md-6">
							Impact is <?=$marker['impact']?>
							</div>
						</div>
						<?php
					}
                    ?>                   
                </div>
            </div> 
            <div id="sidebar-footer" class="col-lg-2 col-md-4 col-sm-6">
           		<div class="col-xs-12">               
                    <form class="form-horizontal">
                        <div class="form-group">
                            <button type="submit" class="btn btn-default col-xs-12">Continue</button>
                        </div>
                    </form>   
                </div>             
            </div>                 
        </div>
    </div>
  </body>
</html>
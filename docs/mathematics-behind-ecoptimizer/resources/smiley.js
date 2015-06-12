function drawSmiley(context, w, h, value) {	
	var colorvalue = 0;
	var strokecolor = 'black';
	if (value >= high) {
		colorvalue = 1;
	} else if (value > low) {
		colorvalue = (value - low) / (high - low);
	}
	colorvalue = 1 - Math.pow(colorvalue,pwr);
	
	var color = numberToColorHsl(colorvalue);	

	var r = (Math.min(h, w) - 20) / 2;
	var eyesize = r / 10;
	var mouthdeviation = (colorvalue * 2 - 1) * r / 2;

	var eyeposY = h / 2 - r / 2.5;
	var eyeposX_L = w / 2 - r / 2.25;
	var eyeposX_R = w / 2 + r / 2.25;

	var mouthposX_L = w / 2 - r / 2;
	var mouthposX_R = w / 2 + r / 2;
	var mouthposX_M = w / 2;
	var mouthposY_LR = h / 2 + r / 3 - mouthdeviation / 4;
	var mouthposY_M = mouthposY_LR + mouthdeviation;
	
	//setup 

	context.lineCap = "round";
	//circle	
	context.fillStyle = color;
	context.beginPath();
	context.arc(w / 2, h / 2, r, 0, 2 * Math.PI);
	//context.closePath();
	context.fill();
	context.lineWidth = eyesize;
	context.stroke();

	//eye left
	context.fillStyle = strokecolor;
	context.beginPath();
	context.arc(eyeposX_L, eyeposY, eyesize, 0, 2 * Math.PI);
	//context.closePath();
	context.fill();
	//eye right
	context.fillStyle = strokecolor;
	context.beginPath();
	context.arc(eyeposX_R, eyeposY, eyesize, 0, 2 * Math.PI);
	//context.closePath();
	context.fill();

	//mouth
	context.beginPath();
	context.moveTo(mouthposX_L, mouthposY_LR);
	context.quadraticCurveTo(mouthposX_M, mouthposY_M, mouthposX_R, mouthposY_LR);
	context.lineWidth = eyesize;
	context.stroke();

}
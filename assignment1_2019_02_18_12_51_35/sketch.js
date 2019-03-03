let R=255, G=255, B=255, radius=6;

function setup() {
	createCanvas(400, 400);
	noStroke();
}

function draw() {
	background(0, 50);
	fill(R,G,B);
	ellipse(mouseX, mouseY, radius, radius);
}

function mouseClicked() {
	R=int(random(255))+1;
	G=int(random(255))+1;
	B=int(random(255))+1;
}

function mouseWheel(event) {
	if (event.delta>0){
		radius=(radius+4+40)%40;
	}
	else if (event.delta<0){
		radius=(radius-4+40)%40;
	}
}
var vehicles = [];

function setup() {
  createCanvas(1000, 600);

  for (var i = 0; i < 50; i++) {
    vehicles.push(new Agent(random(width), random(height)));
  }
}

function draw() {
  background(0);

  for (var i = 0; i < vehicles.length; i++) {
    var v = vehicles[i];

    var target = createVector(mouseX, mouseY);
    v.process(target);
    v.update();
    v.checkEdges();
    v.display();
  }
}

function mousePressed() {
  DEBUG_MODE = !DEBUG_MODE;
}

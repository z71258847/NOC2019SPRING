function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

let p=[];

function draw() {
  background(0);
  if (mouseIsPressed){
    p.push(new Particle(mouseX, mouseY));
  }

  for (let i=0; i<p.length; i++){
    p[i].update();
    p[i].display();
  }

  if (p.length>1000) p.shift();
}

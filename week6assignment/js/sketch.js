"use strict"


let p=[];
let center;

function setup() {
  createCanvas(800, 600);
  background(0);
  center=new Particle(0, 0, 500, 0, 0, 0.005);
  for (let i=0; i<75; i++){
    let x=random(width);
    let y=random(height);
    let r=random(0.5, 1.0);
    let red=random(255);
    let green=random(255);
    let blue=random(255);
    let c=color(red, green, blue, 85);
    let elasticity=random(0.5, 0.8)
    p.push(new Particle(x, y, r, r*10, c, elasticity));
  }
}

function draw() {
  background(0);
  center.setPos(mouseX, mouseY);
  for (let i=0; i<p.length; i++){
    let b=p[i];
    for (let j=0; j<p.length; j++){
      if (j!=i) {
        b.checkCollision(p[j]);
      }
    }
    if (!mouseIsPressed){
      b.applyGAttraction(center);
    }
    else{
      b.applyRepulsion(center);
    }
    b.update();
    b.checkBoundary();
    b.display();
  }
}

"use strict"

let p=[];

function setup() {
  createCanvas(800, 600);
  background(0);
  p.push(new Particle(width/2, height/2, 10));
  p.push(new Particle(width/4, height/2, 20));
  p.push(new Particle(width*3/4, height/2, 30));
}

function draw() {
  background(0);
  for (let i=0; i<p.length; i++){
    //gravity
    let g=createVector(0, 1);
    g.mult(p[i].mass)
    p[i].applyForce(g);

    //wind
    if (mouseIsPressed){
      let w=map(mouseX, 0, width, -5, 5);
      let wind=createVector(w, 0);
      p[i].applyForce(wind);
    }

    let rf=0.1;
    let friction = p[i].vel.copy();
    friction.mult(-1);
    friction.normalize();
    friction.mult(rf);
    p[i].applyForce(friction);

    p[i].update();
    p[i].checkBoundary();
    p[i].display();
  }
}

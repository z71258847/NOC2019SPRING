"use strict"

let p=[];
let e=[];

function setup() {
  let R=color('rgba(255, 0, 0, 5)');
  let G=color('rgba(0, 255, 0, 5)');
  let B=color('rgba(0, 0, 255, 5)');
  createCanvas(800, 600);
  background(0);
  p.push(new Particle(width/2, height/7, 10));
  p.push(new Particle(width/4, height/7, 20));
  p.push(new Particle(width*3/4, height/7, 30));
  e.push(new Env(0, height/2, width/3, height/2, R, 0.1));
  e.push(new Env(width/3, height/2, width/3, height/2, G, 0.5));
  e.push(new Env(width*2/3, height/2, width/3, height/2, B, 0.9));
}

function draw() {
  background(0);
  for (let j=0; j<e.length; j++){
    e[j].display();
  }
  for (let i=0; i<p.length; i++){
    gravity(p[i], 1);
    //wind
    if (mouseIsPressed){
      let w=map(mouseX, 0, width, -5, 5);
      let wind=createVector(w, 0);
      p[i].applyForce(wind);
    }

    friction(p[i], 0.1);

    for (let j=0; j<e.length; j++){
      if (e[j].contains(p[i])){
        resistance(p[i], e[j].c);
      }
    }

    p[i].update();
    p[i].checkBoundary();
    p[i].display();
  }
}

function gravity(obj, c){
  let g=createVector(0, c);
  g.mult(obj.mass)
  obj.applyForce(g);
}

function friction(obj, c){
  let rf=c;
  let friction = obj.vel.copy();
  friction.mult(-1);
  friction.normalize();
  friction.mult(rf);
  obj.applyForce(friction);
}

function resistance(obj, c){
  let speed = obj.vel.mag();
  let mag = c * speed * speed;
  let f = obj.vel.copy();
  f.mult(-1);
  f.normalize();
  f.mult(mag);
  obj.applyForce(f);
}

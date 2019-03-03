"use strict"

class Particle {
  constructor(x, y) {
    this.pos=createVector(x, y);
    this.vel=createVector();
    this.acc=createVector(random(-1,1), random(-1,1));
    this.size=10;
    this.rotateSpd=random(-0.2,0.2);
    this.scl=random(0.5, 2);
  }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0.9);
  }

  display(){
    push();
    fill(255,200);
    noStroke();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount*this.rotateSpd);
    scale(this.scl)
    rectMode(CENTER);
    rect(0, 0, this.size, this.size);
    pop();
  }
}

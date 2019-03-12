"use strict"

class Particle{
  constructor(x, y, size){
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.size = size;
    this.mass = size;
  }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display(){
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(255);
    ellipse(0, 0, this.size, this.size);
    pop();
  }

  applyForce(f){
    let force=f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  checkBoundary(){
    if (this.pos.x>width){
      this.vel.x *= -1;
      this.pos.x=width;
    }
    if (this.pos.x<0) {
      this.vel.x *= -1;
      this.pos.x=0;
    }
    if (this.pos.y>height){
      this.vel.y *= -1;
      this.pos.y=height;
    }
    if (this.pos.y<0){
      this.vel.y *= -1;
      this.pos.y=0;
    }
  }
}

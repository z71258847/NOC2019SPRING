"use strict";
let AWAKE=0;
let SEEK=1;
let DEBUG_MODE=false;
class Agent {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.angle = 0;

    this.maxDesiredVelocity = 10;
    this.maxSteerForce = 0.01;

    this.state = AWAKE;
    this.sleep_pt = 1;
    this.awake_pt = 2;
    //detect
    this.detectVector = createVector();
    this.directionVector = createVector();
    this.predictDistance = 50;
    this.detectRadius = 60;
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle = this.vel.heading();
  }
  process(target){
    if (this.state==AWAKE){
      this.detect(target);
      this.seek(target);
      let r=random(0, 100);
      if (r<this.sleep_pt) this.state=SEEK;
    }
    else{
      let steer = createVector(-this.vel.y, this.vel.x).mult(random(-1, 1));
      steer.limit(0.001);
      this.vel.limit(0.01);
      this.vel.add(steer);
      let r=random(0, 100);
      if (r<this.awake_pt) this.state=AWAKE;
    }
  }
  detect(target) {
    this.detectVector = p5.Vector.mult(this.vel.copy().normalize(), this.predictDistance);
    var centerPos = p5.Vector.add(this.pos, this.detectVector)
    
    this.directionVector = p5.Vector.sub(target, centerPos);
    this.directionVector.setMag(this.detectRadius);
    //this.directionVector.mult(-1);

    var directionPos = p5.Vector.add(centerPos, this.directionVector);
    this.seek(directionPos);
  }
  seek(target) {
    var desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxDesiredVelocity);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxSteerForce);
    this.applyForce(steer);
  }
  applyForce(force) {
    this.acc.add(force);
  }
  checkEdges() {
    if (this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    } else if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);

    push();
    rotate(this.angle);
    noStroke();
    if (this.state==AWAKE) fill(0, 255, 0);
    else fill(255,0,0);
    triangle(0, 0, -20, 8, -20, -8);
    pop();

    pop();
  }
}

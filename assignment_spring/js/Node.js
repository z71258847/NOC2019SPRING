class Node{
  constructor(x, y, m){
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.mass = m;
    this.rad = this.mass * 10;
    this.color = color(random(255),random(255),random(255));
  }
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.mult(0.98);
  }

  applyForce(force){
    let f = force.copy();
    f.div(this.mass);
    this.acc.add(f);
  }

  display(){
    push();
    translate(this.pos.x, this.pos.y);
    stroke(255);
    fill(this.color);
    ellipse(0, 0, this.rad * 2, this.rad * 2);
    pop();
  }

  select(){
    if (mouseIsPressed){
      let distance = dist(this.pos.x, this.pos.y, mouseX, mouseY);
      if (distance < this.rad * 1.5){
        return true;
      }
    }
    return false;
  }

  drag(){
    this.pos.x=mouseX;
    this.pos.y=mouseY;
  }
}

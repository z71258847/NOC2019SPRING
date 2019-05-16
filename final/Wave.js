class Wave{
  constructor(){
    this.particles=[];
    this.springs=[];
    let p0=createVector(width*0.25, height*0.5);
    let p1=createVector(width*0.75, height*0.5);
    for (let i=0; i<10; i++){
      let x = map(i, 0, 99, p0.x, p1.x);
      let y = map(i, 0, 99, p0.y, p1.y);
      this.particles.push(new Particle(x, y, 1, color(255)));
    }
    for (let i=0; i<9; i++){
      let r = map(i, 0, 9, red(FROST), red(FIRE));
      let g = map(i, 0, 9, green(FROST), green(FIRE));
      let b = map(i, 0, 9, blue(FROST), blue(FIRE));
      let dist = p5.Vector.sub(this.particles[i].pos, this.particles[i+1].pos).mag();
      this.springs.push(new Spring(this.particles[i], this.particles[i+1], dist, color(r,g,b)));
    }
  }

  update(p0, p1){
    this.setPos(p0, p1);
    for (let i=0; i<this.springs.length; i++){
      let p = this.springs[i];
      p.update();
    }
    for (let i=0; i<this.particles.length; i++){
      let p = this.particles[i];
      p.update();
      //p.display();
    }
  }

  display(pg){
    for (let i=0; i<this.springs.length; i++){
      let p = this.springs[i];
      p.display(pg);
    }
  }

  setPos(p0, p1){
    let range = 20;
    this.particles[0].setPos(p0.x, p0.y+random(-range, range));
    this.particles[this.particles.length-1].setPos(p1.x, p1.y+random(-range, range));
  }
}

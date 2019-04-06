class Polygon{
  constructor(node_list, color){//assume node_list is a convex hull
    this.pos = compute_gravity_center(node_list);
    this.relative_corner = []
    for (let i=0; i<node_list.length; i++){
      this.relative_corner.push(p5.Vector.sub(node_list[i], this.pos));
    }
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = compute_size(this.relative_corner);
    this.color = color;
    this.collision = false;
  }

  display(){
    push();
    translate(this.pos.x, this.pos.y);
    if (params.debugMode){
      for (let i=0; i<this.relative_corner.length; i++){
        push();
        strokeWeight(0.5);
        if (this.collision) {
          strokeWeight(2);
          stroke(255,0,0);
        }
        fill(this.color);
        triangle(0, 0,
          this.relative_corner[i].x, this.relative_corner[i].y,
          this.relative_corner[(i+1)%this.relative_corner.length].x, this.relative_corner[(i+1)%this.relative_corner.length].y);
        pop();
      }
      push();
      fill(255, 0, 0);//mass
      text(int(this.mass), 0, 0);
      pop();
    }
    else {
      for (let i=0; i<this.relative_corner.length; i++){
        push();
        strokeWeight(1);
        stroke(this.color);
        fill(this.color);
        triangle(0, 0,
          this.relative_corner[i].x, this.relative_corner[i].y,
          this.relative_corner[(i+1)%this.relative_corner.length].x, this.relative_corner[(i+1)%this.relative_corner.length].y);
        pop();
      }
    }
    pop();
    this.collision=false;
  }

  update(){
    this.vel.add(this.acc);
    this.vel.limit(params.velLimit);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(f){
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  applyGAttraction(source){
    let v = p5.Vector.sub(source.pos,this.pos);
    let d = v.mag();
    v.normalize();
    v.mult(params.attractionMagnitude*source.mass*this.mass/d/d);
    this.applyForce(v);
  }

  check_boundary(){
    for (let i=0; i<this.relative_corner.length; i++){
      let temp = p5.Vector.add(this.pos, this.relative_corner[i]);
      if (temp.x<0){
        this.pos.x+=abs(temp.x);
        this.vel.x*=-1;
      }
      if (temp.y<0){
        this.pos.y+=abs(temp.y);
        this.vel.y*=-1;
      }
      if (temp.x>width){
        this.pos.x-=abs(width-temp.x);
        this.vel.x*=-1;
      }
      if (temp.y>height){
        this.pos.y-=abs(height-temp.y);
        this.vel.y*=-1;
      }
    }
  }

  check_collision(other){
    let flag=true;
    if (other instanceof Polygon){
      for (let i=0; i<this.relative_corner.length && flag; i++){//choose self axis
        let cur_line=p5.Vector.sub(this.relative_corner[(i+1)%this.relative_corner.length], this.relative_corner[i]);
        let normal_vec=createVector(-cur_line.y, cur_line.x);
        let selfmin=9999999, selfmax=-9999999;
        let othermin=9999999, othermax=-9999999;
        for (let j=0; j<this.relative_corner.length; j++){//project self points
          if (i!=j){
            let relative_vec = p5.Vector.sub(this.relative_corner[j], this.relative_corner[i]);
            let projection=p5.Vector.dot(normal_vec, relative_vec);
            selfmax=max(selfmax, projection);
            selfmin=min(selfmin, projection);
          }
        }
        for (let j=0; j<other.relative_corner.length; j++){//project self points
          let origin_vec = p5.Vector.add(this.pos, this.relative_corner[i]);
          let target_vec = p5.Vector.add(other.pos, other.relative_corner[j]);
          let relative_vec = p5.Vector.sub(target_vec, origin_vec);
          let projection=p5.Vector.dot(normal_vec, relative_vec);
          othermax=max(othermax, projection);
          othermin=min(othermin, projection);
        }
        if (selfmax<othermin || othermax<selfmin) flag=false;
      }

      for (let i=0; i<other.relative_corner.length && flag; i++){//choose other axis
        let cur_line=p5.Vector.sub(other.relative_corner[(i+1)%other.relative_corner.length], other.relative_corner[i]);
        let normal_vec=createVector(-cur_line.y, cur_line.x);
        let selfmin=9999999, selfmax=-9999999;
        let othermin=9999999, othermax=-9999999;
        for (let j=0; j<other.relative_corner.length; j++){//project other points
          if (i!=j){
            let relative_vec = p5.Vector.sub(other.relative_corner[j], other.relative_corner[i]);
            let projection=p5.Vector.dot(normal_vec, relative_vec);
            othermax=max(othermax, projection);
            othermin=min(othermin, projection);
          }
        }
        for (let j=0; j<this.relative_corner.length; j++){//project self points
          let origin_vec = p5.Vector.add(other.pos, other.relative_corner[i]);
          let target_vec = p5.Vector.add(this.pos, this.relative_corner[j]);
          let relative_vec = p5.Vector.sub(target_vec, origin_vec);
          let projection=p5.Vector.dot(normal_vec, relative_vec);
          selfmax=max(selfmax, projection);
          selfmin=min(selfmin, projection);
        }
        if (selfmax<othermin || othermax<selfmin) flag=false;
      }
    }
    if (flag){//if collision
      this.collision = true;
      other.collision = true;
      let v=p5.Vector.sub(other.pos, this.pos)
      let d=v.mag();
      let magnitude;
      v.normalize();
      magnitude = this.vel.mag() * params.collision_coefficient;
      v.mult(magnitude);
      other.applyForce(v);
      v.normalize();
      magnitude = other.vel.mag() * params.collision_coefficient;
      v.mult(-1);
      v.mult(magnitude);
      this.applyForce(v);
    }
  }
}

function compute_gravity_center(node_list){
  let x=0, y=0, tot_mass=0;
  for (let i=1; i<node_list.length-1; i++){//0, i, i+1 forms triangle
    let triangle_mass=abs(cross(node_list[0], node_list[i], node_list[i+1]))/2.0;
    let triangle_x=(node_list[0].x + node_list[i].x + node_list[i+1].x)/3.0;
    let triangle_y=(node_list[0].y + node_list[i].y + node_list[i+1].y)/3.0;
    x+=triangle_x*triangle_mass;
    y+=triangle_y*triangle_mass;
    tot_mass+=triangle_mass;
  }
  x/=tot_mass;
  y/=tot_mass;
  return createVector(x, y);
}

function compute_size(relative_corner){
  let tot_mass=0;
  for (let i=0; i<relative_corner.length-1; i++){//0, i, i+1 forms triangle
    let triangle_mass=abs(cross(createVector(0,0), relative_corner[i], relative_corner[i+1]))/2.0;
    console.log(triangle_mass);
    tot_mass+=triangle_mass;
  }
  return tot_mass/100;
}

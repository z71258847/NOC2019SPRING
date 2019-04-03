"use strict";

let record_node=[];
let polygons=[];

let params = {
  debugMode: false,
  attractionMagnitude: 2,
  collision_coefficient: 10,
  velLimit: 10,
  colorRed: 255,
  colorGreen: 255,
  colorBlue: 255,
  explode: function() {
      for (let i = 0; i < polygons.length; i++) {
        let p = polygons[i];
        let randomForce = createVector(random(-200, 200), random(-200, 200));
        p.applyForce(randomForce);
      }
    }
};

let gui = new dat.GUI();
gui.add(params, "debugMode");
gui.add(params, "attractionMagnitude", 0.5, 5.0);
gui.add(params, "collision_coefficient", 5, 30);
gui.add(params, "velLimit", 1, 20);
gui.add(params, "colorRed", 0, 255);
gui.add(params, "colorGreen", 0, 255);
gui.add(params, "colorBlue", 0, 255);
gui.add(params, "explode");

function setup() {
  createCanvas(windowWidth-10, windowHeight-10);
  background(0);
}


function draw() {
  background(0);
  show_cur_color();

  for (let i=0; i<polygons.length; i++){
    for (let j=0; j<polygons.length; j++){
      if (i!=j) {
        polygons[i].applyGAttraction(polygons[j]);
        polygons[i].check_collision(polygons[j]);
      }
    }
    polygons[i].check_boundary();
    polygons[i].update();
    polygons[i].display();
  }

  for (let i=0; i<record_node.length; i++){
    push();
    noStroke();
    fill(255);
    circle(record_node[i].x, record_node[i].y, 2);
    pop();
  }

}

function show_cur_color(){
  let temp_c=color(params.colorRed, params.colorGreen, params.colorBlue, 100);
  push();
  fill(temp_c);
  noStroke();
  rectMode(CENTER);
  rect(width-25, height-25, 50, 50);
  pop();
}

function keyPressed() {
  if (keyCode == 69) {
    if (record_node.length>2){
      record_node=convex_hull(record_node);
      let temp_c=color(params.colorRed, params.colorGreen, params.colorBlue, 100);
      polygons.push(new Polygon(record_node, temp_c));
      record_node=[];
    }
  }
  if (keyCode == 65) {
      let cur_pos=createVector(mouseX, mouseY);
      record_node.push(cur_pos);
  }
}

function cross(o, a, b){//vector oa, ob
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function compare_angle(o, a, b){//compare oa, ob
  let c=cross(o, a, b);
  let oa=p5.Vector.sub(a, o);
  let ob=p5.Vector.sub(b, o);
  return (c<0 || (c==0 && oa.mag()>ob.mag()));
}

function convex_hull(node_list){
  let new_list=[];
  let mini=0;
  for (let i=1; i<node_list.length; i++){
    if (node_list[i].x<node_list[mini].x || (node_list[i].x==node_list[mini].x && node_list[i].y < node_list[mini].y)){
        mini=i;
    }
  }
  let temp=node_list[0]; node_list[0]=node_list[mini];node_list[mini]=temp;
  for (let i=1; i<node_list.length; i++){
    for (let j=i+1; j<node_list.length; j++){
      if (compare_angle(node_list[0], node_list[i], node_list[j])){
        temp=node_list[i];node_list[i]=node_list[j];node_list[j]=temp;
      }
    }
  }
  for (let i=0; i<node_list.length; i++){
    let l=new_list.length;
    while (l>=2 && cross(new_list[l-2], new_list[l-1], node_list[i])<=0) {
      new_list.pop();
      l--;
    }
    new_list.push(node_list[i]);
  }
  return new_list;
}

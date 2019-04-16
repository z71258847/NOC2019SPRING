"use strict";

let n, e;
let nodes = [];
let edges = [];
let MAX_L = 500;
let MAX_N = 20;
let drag_num=-1;
function generate_node(){
  let r=random(width/4, 3*width/4);
  let c=random(height/4, 3*height/4);
  nodes.push(new Node(r, c, random(1.5,3)));
}

function generate_edge(u, v){
  let length = random(100, MAX_L);
  edges.push(new Spring(u, v, length));
}

function generate_graph(){
  n=random(2, MAX_N);
  e=n-1;
  for (let i=0; i<n; i++) generate_node();
  for (let i=0; i<n-1; i++) {
    generate_edge(nodes[i], nodes[i+1]);
  }
  for (let i=0; i<n; i++){
    for (let j=i+2; j<n; j++){
      let rnd = random(1);
      if (rnd < 0.25) {
        generate_edge(nodes[i], nodes[j]);
        e+=1;
      }
    }
  }

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  generate_graph();
}

function draw() {
  background(0);
  for (let i=0; i<n; i++){
    let t=nodes[i];
    if (!mouseIsPressed) drag_num=-1;
    if (drag_num==-1 && t.select()) drag_num=i;
    if (drag_num==i) t.drag();
    t.update();
    t.display();
  }

  for (let i=0; i<e; i++){
    let s=edges[i];
    s.update();
    s.display();
  }

}

"use strict";
let video;
let poseNet;
let poses = [];
let debugMode=false;
let SIN_ARRAY = [];
let COS_ARRAY = [];
let SINCOS_DETAIL = 1;

let FROST;
let FIRE;
let MAX_ORBIT=50;
let WAVE_NUM=5;

let eyes, face, leftArm, rightArm, leftLeg, rightLeg, body;
let leftOrb, rightOrb;
let isLeftOrb=false, isRightOrb=false;
let waves=[];

let buffer1;
let cooling;
let ystart=0;
let increment = 0.02;
let NOISEAMP = 10;
let isFire=false, isFrost=false;
let pgEffects;


function setup() {

  FROST = color(50,120,180,100);
  FIRE = color(150,60,40,100);

  for (let a = 0; a < 360; a+= 1/SINCOS_DETAIL){
    SIN_ARRAY.push(sin( radians(a) ));
    COS_ARRAY.push(cos( radians(a) ));
  }

  for (let i=0; i<WAVE_NUM; i++){
    waves.push(new Wave());
  }

  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
  pixelDensity(1);
  pgEffects = createGraphics(width, height);
  buffer1 = createGraphics(width, height);
  buffer1.background(0);
  initialize_cooling();
  background(0);
}

function modelReady() {
}

function draw() {
  //if (frameCount>1000) return;
  //image(video, 0, 0, width, height);
  background(0);
  // We can call both functions to draw all keypoints and the skeletons
  processKeypoints();
  drawSkeleton();
  update_cooling();
  applycooling();
  push();
  translate(width,0);
  scale(-1, 1);
  image(buffer1, 0, 0, width, height);
  pop();
  blendMode(ADD);
  pgEffects.background(0, 40);
  drawHead(pgEffects);
  drawSpell(pgEffects);
  push();
  translate(width,0);
  scale(-1, 1);
  image(pgEffects, 0, 0, width, height);
  pop();
  blendMode(NORMAL);
}

function initialize_cooling(){
  cooling=[];
  for (let i=0; i<width; i++){
    for (let j=0; j<height; j++){
      cooling.push(0);
    }
  }
  let yoff=0.0;
  for (let y=0; y<height; y++){
    yoff+=increment;
    let xoff = 0.0;
    for (let x=0; x<width; x++){
      let idx=(x+y*width);
      xoff+=increment;
      let noiseVal=noise(xoff, yoff)*NOISEAMP;
      cooling[idx]=noiseVal;
    }
  }
  ystart=yoff;
}


function update_cooling(){
  for (let y=0; y<height-1; y++){
    for (let x=0; x<width; x++){
      let idx0=(x+y*width);
      let idx1=(x+(y+1)*width);
      cooling[idx0]=cooling[idx1];
    }
  }
  ystart+=increment;
  let xoff = 0.0;
  let y = height-1;
  for (let x=0; x<width; x++){
    let idx=(x+y*width);
    xoff+=increment;
    let noiseVal=noise(xoff, ystart)*NOISEAMP;
    cooling[idx]=noiseVal;
    cooling[idx+1]=noiseVal;
    cooling[idx+2]=noiseVal;
  }
}

function generate_spell(x0, x1, color){
  let r=red(color), g=green(color), b=blue(color);
  for (let i=1; i<10; i++) {
    let y=height-i;
    for (let x=x0; x<x1; x++){
      let idx0=((x)+(y)*width)*4;
      buffer1.pixels[idx0]=r;
      buffer1.pixels[idx0+1]=g;
      buffer1.pixels[idx0+2]=b;
    }
  }
}

function applycooling(){
  let buffer2=createGraphics(width, height);
  buffer2.background(0);
  if (isFrost && isFire){
    generate_spell(0, width/2, FIRE);
    generate_spell(width/2, width, FROST);
  }
  else if (isFrost){
    generate_spell(0, width, FROST);
  }
  else if (isFire){
    generate_spell(0, width, FIRE);
  }
  buffer1.loadPixels();
  buffer2.loadPixels();
  for (let x=1; x<width-1; x++){
    for (let y=1; y<height-1; y++){
      let idx0=((x)+(y)*width)*4;
      let idx1=((x+1)+(y)*width)*4;
      let idx2=((x-1)+(y)*width)*4;
      let idx3=((x)+(y+1)*width)*4;
      let idx4=((x)+(y-1)*width)*4;
      let r=buffer1.pixels[idx1]+buffer1.pixels[idx2]+buffer1.pixels[idx3]+buffer1.pixels[idx4];
      let g=buffer1.pixels[idx1+1]+buffer1.pixels[idx2+1]+buffer1.pixels[idx3+1]+buffer1.pixels[idx4+1];
      let b=buffer1.pixels[idx1+2]+buffer1.pixels[idx2+2]+buffer1.pixels[idx3+2]+buffer1.pixels[idx4+2];
      buffer2.pixels[idx4]=r*0.25-cooling[idx0/4];
      buffer2.pixels[idx4+1]=g*0.25-cooling[idx0/4];
      buffer2.pixels[idx4+2]=b*0.25-cooling[idx0/4];
    }
  }
  //buffer1.updatePixels();
  buffer2.updatePixels();
  buffer1 = buffer2;
}


function drawSpell(pgEffects){
  if (checkLeftArm() && leftArm[1].y>leftArm[2].y){
    if (!isLeftOrb){
      isLeftOrb=true;
      let templ = p5.Vector.sub(leftArm[0], leftArm[1]).mag();
      let s = map(templ, 0, 1000, 1, 10);
      leftOrb=new SpellOrb(leftArm[2].x, leftArm[2].y, s, FROST);
    }
    leftOrb.setPos(leftArm[2].x, leftArm[2].y);
    leftOrb.update();
    leftOrb.display(pgEffects);
  }
  else{
    isLeftOrb=false;
  }
  if (checkRightArm() && rightArm[1].y>rightArm[2].y){
    if (!isRightOrb){
      isRightOrb=true;
      let templ = p5.Vector.sub(rightArm[0], rightArm[1]).mag();
      let s = map(templ, 0, 1000, 1, 10);
      rightOrb=new SpellOrb(rightArm[2].x, rightArm[2].y, s, FIRE);
    }
    rightOrb.setPos(rightArm[2].x, rightArm[2].y);
    rightOrb.update();
    rightOrb.display(pgEffects);
  }
  else {
    isRightOrb=false;
  }
  if (isLeftOrb && isRightOrb){
    for (let i=0; i<waves.length; i++) waves[i].update(leftArm[2], rightArm[2]);
    let dist=p5.Vector.sub(leftArm[2],rightArm[2]).mag();
    if (dist<width*0.5){
      for (let i=0; i<waves.length; i++) waves[i].display(pgEffects);
    }
  }
  if (isLeftOrb && leftArm[2].y<leftArm[0].y){
    isFrost=true;
  }
  else{
    isFrost=false;
  }
  if (isRightOrb && rightArm[2].y<rightArm[0].y){
    isFire=true;
  }
  else{
    isFire=false;
  }
}

// A function to draw ellipses over the detected keypoints
function processKeypoints()  {
  eyes=[];
  face=[];
  leftArm=[];
  rightArm=[];
  body=[];
  // Loop through all the poses detected
  // For each pose detected, loop through all the keypoints
  if (poses.length==0) return;
  let pose = poses[0].pose;
  for (let j = 0; j < pose.keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = pose.keypoints[j];
    // Only draw an ellipse is the pose probability is bigger than 0.2
    if (keypoint.score > 0.1) {
      if (debugMode){
        push();
        fill(255,0,0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y,10,10);
        pop();
      }
      switch (j) {
        case 0:face.push(createVector(keypoint.position.x, keypoint.position.y));break;//nose
        case 1:eyes.push(createVector(keypoint.position.x, keypoint.position.y));break;//leftEye
        case 2:eyes.push(createVector(keypoint.position.x, keypoint.position.y));break;//rightEye
        case 3:face.push(createVector(keypoint.position.x, keypoint.position.y));break;//leftEar
        case 4:face.push(createVector(keypoint.position.x, keypoint.position.y));break;//rightEar
        case 5:body.push(createVector(keypoint.position.x, keypoint.position.y));//leftShoulder
        leftArm.push(createVector(keypoint.position.x, keypoint.position.y));
        break;
        case 6:body.push(createVector(keypoint.position.x, keypoint.position.y));//rightShoulder
        rightArm.push(createVector(keypoint.position.x, keypoint.position.y));
        break;
        case 7:leftArm.push(createVector(keypoint.position.x, keypoint.position.y));break;//leftElbow
        case 8:rightArm.push(createVector(keypoint.position.x, keypoint.position.y));break;//rightElbow
        case 9:leftArm.push(createVector(keypoint.position.x, keypoint.position.y));break;//leftWrist
        case 10:rightArm.push(createVector(keypoint.position.x, keypoint.position.y));break;//rightWrist
        case 11:body.push(createVector(keypoint.position.x, keypoint.position.y));break;//leftHip
        case 12:body.push(createVector(keypoint.position.x, keypoint.position.y));break;//rightHip
      }
    }
  }
}

function checkEyes(){
  return (eyes.length==2);
}
function checkFace(){
  return (face.length==3);
}
function checkLeftArm(){
  return (leftArm.length==3);
}
function checkRightArm(){
  return (rightArm.length==3);
}
function checkBody(){
  return (body.length==4);
}


// A function to draw the skeletons
function drawSkeleton() {
  if (checkLeftArm()){
    drawArm(leftArm);
  }
  if (checkRightArm()){
    drawArm(rightArm);
  }
  if (checkBody()){
    drawBody(body);
  }
  if (checkFace()){
    drawFace();
  }
}

function drawHead(pgEffects){
  if (checkEyes()){
    drawEyes(pgEffects);
  }
}

function drawFace(){
  let dist1=p5.Vector.sub(face[0],face[1]).mag();
  let dist2=p5.Vector.sub(face[0],face[2]).mag();
  let radius=max(dist1, dist2);
  draw_circle(face[0].x, face[0].y, radius, 3, color(100));
  /*push();
  noFill();
  strokeWeight(3);
  stroke(100);
  circle(face[0].x, face[0].y, radius);
  pop();*/
}

function drawEyes(pgEffects){
  let dist = p5.Vector.sub(eyes[0],eyes[1]).mag();
  let scl = map(dist, 0, width, 0.1, 1.3);
  drawFire(eyes[0].x, eyes[0].y, scl, pgEffects);
  drawFire(eyes[1].x, eyes[1].y, scl, pgEffects);
}

function drawArm(arm){
  for (let i=0; i<2; i++){
    let p1=arm[i];
    let p2=arm[i+1];
    draw_line(p1.x, p1.y, p2.x, p2.y, 3, color(100));
  }
}

function drawBody(body){
  //leftShoulder, rightShoulder, leftHip, rightHip
  let upMid = p5.Vector.add(body[0], body[1]).mult(0.5);
  let downMid = p5.Vector.add(body[2], body[3]).mult(0.5);
  //line(body[0].x, body[0].y, body[2].x, body[2].y);
  //line(body[1].x, body[1].y, body[3].x, body[3].y);
  draw_line(upMid.x, upMid.y, downMid.x, downMid.y, 3, color(100));
  for (let i=0; i<4; i++){
    let posmidx=map(i, 0, 3, upMid.x, (downMid.x+upMid.x)*0.5);
    let posmidy=map(i, 0, 3, upMid.y, (downMid.y+upMid.y)*0.5);
    let posleftx=map(i, 0, 3, body[0].x, body[2].x);
    let poslefty=map(i, 0, 3, body[0].y, (body[0].y+body[2].y)*0.45);
    let posrightx=map(i, 0, 3, body[1].x, body[3].x);
    let posrighty=map(i, 0, 3, body[1].y, (body[1].y+body[3].y)*0.45);
    draw_line(posmidx, posmidy, posleftx, poslefty, 3, color(100));
    draw_line(posmidx, posmidy, posrightx, posrighty, 3, color(100));
  }
}

function drawFire(_x, _y, _s, pg){
  pg.push();
  pg.blendMode(ADD);
  pg.translate(_x, _y+5);
  pg.scale(_s);
  noStroke();
  let angle, amp, x, y;
  for (let i=0; i<10; i++){
    amp = 10+i;
    angle = frameCount * 0.01 * i;
    x = fastCos(angle) * amp;
    y = fastSin(angle) * amp;
    let s=100-10*i;
    pg.fill(50, 120, 120, 200-20*i);
    pg.ellipse(random(-2, 2)*i, -i*12, s, s);
  }
  pg.pop();
}

function draw_circle(x0, y0, radius, l, color){
  let r=red(color), g=green(color), b=blue(color), a=alpha(color);
  for (let i=-l/2; i<=l/2; i++) {
    _draw_circle(x0, y0, radius+i, r, g, b, a);
  }
}


function _draw_circle(x0, y0, radius, r, g, b, a){
  buffer1.loadPixels();
  let x = int(radius)-1;
  let y = 0;
  let dx = 1;
  let dy = 1;
  let err = dx - (radius *  2);
  while (x >= y){
    draw_pixel(x0 + x, y0 + y, r, g, b, a);
    draw_pixel(x0 + y, y0 + x, r, g, b, a);
    draw_pixel(x0 - y, y0 + x, r, g, b, a);
    draw_pixel(x0 - x, y0 + y, r, g, b, a);
    draw_pixel(x0 - x, y0 - y, r, g, b, a);
    draw_pixel(x0 - y, y0 - x, r, g, b, a);
    draw_pixel(x0 + y, y0 - x, r, g, b, a);
    draw_pixel(x0 + x, y0 - y, r, g, b, a);
    if (err <= 0){
      y++;
      err += dy;
      dy += 2;
    }
    if (err > 0){
      x--;
      dx += 2;
      err += dx - (radius*2);
    }
  }
  buffer1.updatePixels();
}

function draw_line(x0, y0, x1, y1, l, color){
  let r=red(color), g=green(color), b=blue(color), a=alpha(color);
  for (let i=-l/2; i<l/2; i++){
    _draw_line(x0+i, y0+i, x1+i, y1+i, r, g, b, a);
  }
}

function _draw_line(x0, y0, x1, y1, r, g, b, a){
  let dx;
  let dy;
  let temp;
  let eps=1e-6;
  let derr;
  let err=0.0;
  let y;
  let x;
  let flag=1;
  buffer1.loadPixels();
  x0=int(x0);y0=int(y0);x1=int(x1);y1=int(y1);
  if (x0==x1) {
    if (y0<y1) {
      //GLCD_DrawVLine(x0, y0, (y1-y0));
      for (let y=y0; y<y1; y++){
        draw_pixel(x0, y, r, g, b, a);
      }
      buffer1.updatePixels();
      return;
    }
    //GLCD_DrawVLine(x0, y1, (y0-y1));
    for (let y=y1; y<y0; y++){
      draw_pixel(x0, y, r, g, b, a);
    }
    buffer1.updatePixels();
    return;
  }
  if (Math.abs(x0-x1)<Math.abs(y0-y1)){
    temp=x0; x0=y0; y0=temp;
    temp=x1; x1=y1; y1=temp;
    flag=0;
  }
  if (x0>x1){
    temp=x0;x0=x1;x1=temp;
    temp=y0;y0=y1;y1=temp;
  }
  dx=x1 - x0;
  dy=y1 - y0;
  derr=Math.abs(dy/dx);
  y=y0;
  for (x=x0; x<=x1; x++){
    if (flag) {
      draw_pixel(x, y, r, g, b, a);
    }
    else {
      let idx = (y+x*width)*4;
      draw_pixel(y, x, r, g, b, a);
    }
    err+=derr;
    if (err-0.5>=eps) {
      if (dy>0) y+=1;
      else if (dy<0) y-=1;
      err-=1.0;
    }
  }
  buffer1.updatePixels();
}

function draw_pixel(x, y, r, g, b, a){
  let idx=(int(x)+int(y)*width)*4;
  buffer1.pixels[idx]=r;
  buffer1.pixels[idx+1]=g;
  buffer1.pixels[idx+2]=b;
  buffer1.pixels[idx+3]=a;
}

function fastSin(angle){
  let deg = degrees(angle) % 360;
  let index = int(deg);
  return SIN_ARRAY[index];
}

function fastCos(angle){
  let deg = degrees(angle) % 360;
  let index = int(deg);
  return COS_ARRAY[index];
}
